import { Request, Response } from 'express';
import crypto from 'crypto';
import { logger } from '../utils/logger';
import { environment } from '../config/environment';
import { UnipileWebhookEvent, UnipileMessage, UnipileChat } from '../types/unipile';
import { UnipileService } from '../services/unipile.service';
import { AIEngineService } from '../services/ai-engine.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const unipileService = new UnipileService();
const aiEngineService = new AIEngineService();

export class WebhooksController {

  /**
   * Gestionnaire principal des webhooks Unipile
   */
  async handleUnipileWebhook(req: Request, res: Response) {
    try {
      const signature = req.headers['x-unipile-signature'] as string;
      const payload = JSON.stringify(req.body);

      // Vérifier la signature du webhook
      if (!signature || !unipileService.verifyWebhookSignature(payload, signature)) {
        logger.warn('Invalid webhook signature received', {
          signature,
          payloadLength: payload.length
        });
        return res.status(401).json({
          success: false,
          error: { message: 'Invalid signature' }
        });
      }

      const event: UnipileWebhookEvent = req.body;

      logger.info('Unipile webhook received', {
        type: event.type,
        accountId: event.account_id,
        timestamp: event.timestamp
      });

      // Router l'événement vers le bon gestionnaire
      switch (event.type) {
        case 'MESSAGE_RECEIVED':
          await this.handleMessageReceived(event);
          break;
        case 'MESSAGE_SENT':
          await this.handleMessageSent(event);
          break;
        case 'MESSAGE_STATUS_UPDATED':
          await this.handleMessageStatusUpdate(event);
          break;
        case 'CHAT_UPDATED':
          await this.handleChatUpdated(event);
          break;
        case 'ACCOUNT_DISCONNECTED':
          await this.handleAccountDisconnected(event);
          break;
        default:
          logger.warn('Unknown webhook event type', { type: event.type });
      }

      res.status(200).json({
        success: true,
        message: 'Webhook processed successfully'
      });

    } catch (error) {
      logger.error('Error processing Unipile webhook:', error);
      res.status(500).json({
        success: false,
        error: { message: 'Internal server error' }
      });
    }
  }

  /**
   * Gérer un message reçu
   */
  private async handleMessageReceived(event: UnipileWebhookEvent) {
    try {
      const messageData = event.data as UnipileMessage;
      
      // Trouver le canal correspondant
      const channel = await this.findChannelByUnipileAccountId(event.account_id);
      if (!channel) {
        logger.warn('Channel not found for Unipile account', { accountId: event.account_id });
        return;
      }

      // Créer ou récupérer la conversation
      const conversation = await this.findOrCreateConversation(
        channel.id,
        messageData.chat_id,
        messageData.sender,
        messageData.recipients
      );

      // Créer le message dans la base de données
      const message = await prisma.message.create({
        data: {
          conversationId: conversation.id,
          channelId: channel.id,
          externalId: messageData.id,
          direction: 'INBOUND',
          content: messageData.content,
          contentType: this.mapUnipileContentType(messageData.type),
          status: 'DELIVERED',
          metadata: {
            unipile_data: messageData,
            sender: messageData.sender,
            attachments: messageData.attachments || []
          },
          createdAt: new Date(messageData.timestamp)
        }
      });

      // Mettre à jour la conversation
      await prisma.conversation.update({
        where: { id: conversation.id },
        data: {
          lastMessageAt: new Date(messageData.timestamp),
          unreadCount: { increment: 1 },
          updatedAt: new Date()
        }
      });

      logger.info('Message received and stored', {
        messageId: message.id,
        conversationId: conversation.id,
        channelId: channel.id
      });

      // TODO: Déclencher la génération de réponse IA si configuré
      await this.triggerAIResponse(conversation.id, message.id);

    } catch (error) {
      logger.error('Error handling message received:', error);
    }
  }

  /**
   * Gérer un message envoyé
   */
  private async handleMessageSent(event: UnipileWebhookEvent) {
    try {
      const messageData = event.data as UnipileMessage;
      
      // Mettre à jour le statut du message s'il existe déjà
      await prisma.message.updateMany({
        where: {
          externalId: messageData.id,
          direction: 'OUTBOUND'
        },
        data: {
          status: 'SENT',
          metadata: {
            unipile_data: messageData
          }
        }
      });

      logger.info('Message sent status updated', {
        externalId: messageData.id
      });

    } catch (error) {
      logger.error('Error handling message sent:', error);
    }
  }

  /**
   * Gérer la mise à jour du statut d'un message
   */
  private async handleMessageStatusUpdate(event: UnipileWebhookEvent) {
    try {
      const messageData = event.data as UnipileMessage;
      
      await prisma.message.updateMany({
        where: {
          externalId: messageData.id
        },
        data: {
          status: this.mapUnipileMessageStatus(messageData.status),
          metadata: {
            unipile_data: messageData
          }
        }
      });

      logger.info('Message status updated', {
        externalId: messageData.id,
        status: messageData.status
      });

    } catch (error) {
      logger.error('Error handling message status update:', error);
    }
  }

  /**
   * Gérer la mise à jour d'un chat
   */
  private async handleChatUpdated(event: UnipileWebhookEvent) {
    try {
      const chatData = event.data as UnipileChat;
      
      // Mettre à jour les métadonnées de la conversation si elle existe
      await prisma.conversation.updateMany({
        where: {
          externalId: chatData.id
        },
        data: {
          metadata: {
            unipile_chat_data: chatData,
            last_updated: new Date().toISOString()
          }
        }
      });

      logger.info('Chat updated', {
        chatId: chatData.id
      });

    } catch (error) {
      logger.error('Error handling chat updated:', error);
    }
  }

  /**
   * Gérer la déconnexion d'un compte
   */
  private async handleAccountDisconnected(event: UnipileWebhookEvent) {
    try {
      // Désactiver tous les canaux associés à ce compte Unipile
      await prisma.channel.updateMany({
        where: {
          metadata: {
            path: ['unipile_account_id'],
            equals: event.account_id
          }
        },
        data: {
          isActive: false,
          metadata: {
            disconnected_at: new Date().toISOString(),
            disconnect_reason: 'webhook'
          }
        }
      });

      logger.info('Account disconnected, channels deactivated', {
        accountId: event.account_id
      });

    } catch (error) {
      logger.error('Error handling account disconnected:', error);
    }
  }

  // Méthodes utilitaires

  private async findChannelByUnipileAccountId(unipileAccountId: string) {
    return await prisma.channel.findFirst({
      where: {
        metadata: {
          path: ['unipile_account_id'],
          equals: unipileAccountId
        }
      }
    });
  }

  private async findOrCreateConversation(
    channelId: string,
    chatId: string,
    sender: any,
    recipients: any[]
  ) {
    // Chercher une conversation existante
    let conversation = await prisma.conversation.findFirst({
      where: {
        channelId,
        externalId: chatId
      }
    });

    if (!conversation) {
      // Créer une nouvelle conversation
      conversation = await prisma.conversation.create({
        data: {
          channelId,
          externalId: chatId,
          name: this.generateConversationName(sender, recipients),
          status: 'ACTIVE',
          metadata: {
            sender,
            recipients,
            created_from_webhook: true
          }
        }
      });
    }

    return conversation;
  }

  private generateConversationName(sender: any, recipients: any[]): string {
    // Générer un nom basé sur les participants
    const participants = [sender, ...recipients];
    const names = participants
      .map(p => p.name || p.email || p.phone || 'Unknown')
      .filter(Boolean);
    
    return names.length > 0 ? names.join(', ') : 'New Conversation';
  }

  private mapUnipileContentType(unipileType: string): string {
    const typeMap: Record<string, string> = {
      'TEXT': 'text',
      'IMAGE': 'image',
      'FILE': 'file',
      'AUDIO': 'audio',
      'VIDEO': 'video',
      'LINK': 'link'
    };
    return typeMap[unipileType] || 'text';
  }

  private mapUnipileMessageStatus(unipileStatus: string): string {
    const statusMap: Record<string, string> = {
      'PENDING': 'PENDING',
      'SENT': 'SENT',
      'DELIVERED': 'DELIVERED',
      'READ': 'READ',
      'FAILED': 'FAILED'
    };
    return statusMap[unipileStatus] || 'PENDING';
  }

  private async triggerAIResponse(conversationId: string, messageId: string) {
    try {
      // Récupérer le message et la conversation
      const message = await prisma.message.findUnique({
        where: { id: messageId },
        include: {
          conversation: {
            include: {
              channel: true
            }
          }
        }
      });

      if (!message || !message.conversation) {
        logger.warn('Message or conversation not found for AI response', { messageId });
        return;
      }

      // Vérifier si la réponse IA est activée pour ce canal
      const channel = message.conversation.channel;
      const aiEnabled = channel.settings?.ai?.enabled;
      
      if (!aiEnabled) {
        logger.debug('AI response not enabled for channel', { channelId: channel.id });
        return;
      }

      // Vérifier si c'est un message entrant (pas une réponse IA)
      if (message.direction !== 'INBOUND') {
        logger.debug('Skipping AI response for outbound message', { messageId });
        return;
      }

      // Vérifier si on a déjà répondu récemment à cette conversation
      const recentAIResponse = await prisma.message.findFirst({
        where: {
          conversationId,
          direction: 'OUTBOUND',
          createdAt: {
            gte: new Date(Date.now() - 5 * 60 * 1000) // 5 minutes
          }
        }
      });

      if (recentAIResponse) {
        logger.debug('Recent AI response exists, skipping', { conversationId });
        return;
      }

      // Générer la réponse IA
      const aiResponse = await aiEngineService.generateResponse({
        message: message.content,
        agentConfig: {
          type: channel.settings?.ai?.agentType || 'CUSTOMER_SUPPORT',
          model: channel.settings?.ai?.model || 'gpt-4o',
          temperature: channel.settings?.ai?.temperature || 0.7,
          maxTokens: channel.settings?.ai?.maxTokens || 300
        },
        context: {
          conversationHistory: await this.getConversationHistory(conversationId),
          channelType: channel.type,
          userProfile: channel.settings?.ai?.userProfile
        }
      });

      if (aiResponse.success && aiResponse.response) {
        // Envoyer la réponse via Unipile
        await this.sendAIResponse(
          channel.metadata?.unipile_account_id,
          message.conversation.externalId,
          aiResponse.response
        );

        // Stocker la réponse dans la base de données
        await prisma.message.create({
          data: {
            conversationId,
            channelId: channel.id,
            direction: 'OUTBOUND',
            content: aiResponse.response,
            contentType: 'text',
            status: 'PENDING',
            metadata: {
              ai_generated: true,
              ai_model: aiResponse.model,
              ai_confidence: aiResponse.confidence,
              response_to: messageId
            }
          }
        });

        logger.info('AI response sent successfully', {
          conversationId,
          responseTo: messageId,
          model: aiResponse.model
        });
      }

    } catch (error) {
      logger.error('Error triggering AI response:', error);
    }
  }

  private async sendAIResponse(accountId: string, chatId: string, content: string) {
    try {
      // TODO: Implémenter l'envoi via l'API Unipile
      logger.info('Sending AI response via Unipile', {
        accountId,
        chatId,
        contentLength: content.length
      });

      // Pour le moment, on simule l'envoi
      // await unipileService.sendMessage(accountId, chatId, content);

    } catch (error) {
      logger.error('Error sending AI response via Unipile:', error);
      throw error;
    }
  }

  private async getConversationHistory(conversationId: string): Promise<Array<{ role: 'user' | 'assistant'; content: string }>> {
    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      take: 10 // Limiter l'historique
    });

    return messages.map(msg => ({
      role: msg.direction === 'INBOUND' ? 'user' : 'assistant',
      content: msg.content
    }));
  }

  private async getConversationIdFromChatId(chatId: string): Promise<string> {
    const conversation = await prisma.conversation.findFirst({
      where: { externalId: chatId }
    });
    return conversation?.id || '';
  }
} 