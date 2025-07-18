import { Request, Response } from 'express';
import crypto from 'crypto';
import { logger } from '../utils/logger';
import { environment } from '../config/environment';
import { UnipileWebhookEvent } from '../types/unipile';
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
      
      // Mettre à jour la conversation correspondante
      await prisma.conversation.updateMany({
        where: {
          externalId: chatData.id
        },
        data: {
          name: chatData.name,
          metadata: {
            unipile_data: chatData,
            participants: chatData.participants,
            is_archived: chatData.is_archived,
            is_muted: chatData.is_muted
          }
        }
      });

      logger.info('Chat updated', {
        chatId: chatData.id,
        name: chatData.name
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
      // Désactiver le canal correspondant
      const channel = await this.findChannelByUnipileAccountId(event.account_id);
      if (channel) {
        await prisma.channel.update({
          where: { id: channel.id },
          data: {
            isActive: false,
            metadata: {
              ...channel.metadata,
              disconnected_at: new Date().toISOString(),
              disconnect_reason: 'account_disconnected_webhook'
            }
          }
        });

        logger.warn('Channel automatically disconnected due to Unipile account disconnection', {
          channelId: channel.id,
          unipileAccountId: event.account_id
        });
      }

    } catch (error) {
      logger.error('Error handling account disconnected:', error);
    }
  }

  /**
   * Trouver un canal par ID de compte Unipile
   */
  private async findChannelByUnipileAccountId(unipileAccountId: string) {
    return await prisma.channel.findFirst({
      where: {
        metadata: {
          path: ['unipile_account_id'],
          equals: unipileAccountId
        },
        isActive: true
      }
    });
  }

  /**
   * Trouver ou créer une conversation
   */
  private async findOrCreateConversation(
    channelId: string,
    chatId: string,
    sender: any,
    recipients: any[]
  ) {
    // Chercher la conversation existante
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
          name: sender.name || recipients[0]?.name || 'Conversation',
          status: 'ACTIVE',
          priority: 'NORMAL',
          metadata: {
            sender,
            recipients,
            chat_type: recipients.length > 1 ? 'GROUP' : 'INDIVIDUAL'
          }
        }
      });

      logger.info('New conversation created', {
        conversationId: conversation.id,
        chatId,
        channelId
      });
    }

    return conversation;
  }

  /**
   * Mapper le type de contenu Unipile vers notre enum
   */
  private mapUnipileContentType(unipileType: string): string {
    const mapping: Record<string, string> = {
      'TEXT': 'TEXT',
      'IMAGE': 'IMAGE',
      'FILE': 'FILE',
      'AUDIO': 'AUDIO',
      'VIDEO': 'VIDEO',
      'LINK': 'LINK'
    };
    return mapping[unipileType] || 'TEXT';
  }

  /**
   * Mapper le statut de message Unipile vers notre enum
   */
  private mapUnipileMessageStatus(unipileStatus: string): string {
    const mapping: Record<string, string> = {
      'PENDING': 'PENDING',
      'SENT': 'SENT',
      'DELIVERED': 'DELIVERED',
      'READ': 'READ',
      'FAILED': 'FAILED'
    };
    return mapping[unipileStatus] || 'PENDING';
  }

  /**
   * Déclencher une réponse IA si configuré
   */
  private async triggerAIResponse(conversationId: string, messageId: string) {
    try {
      logger.info('AI response triggered', {
        conversationId,
        messageId
      });

      // Vérifier si l'AI Engine est accessible
      const isAIAvailable = await aiEngineService.healthCheck();
      if (!isAIAvailable) {
        logger.warn('AI Engine is not available, skipping auto-response');
        return;
      }

      // Récupérer les détails du message et de la conversation
      const message = await prisma.message.findUnique({
        where: { id: messageId },
        include: {
          conversation: {
            include: {
              channel: true,
              messages: {
                orderBy: { createdAt: 'desc' },
                take: 10, // Historique des 10 derniers messages
                select: {
                  content: true,
                  direction: true,
                  createdAt: true
                }
              }
            }
          }
        }
      });

      if (!message || !message.conversation) {
        logger.warn('Message or conversation not found for AI response');
        return;
      }

      // Construire l'historique de conversation
      const conversationHistory = message.conversation.messages.map(msg => ({
        role: msg.direction === 'INBOUND' ? 'user' : 'assistant' as const,
        content: msg.content
      }));

      // Contexte enrichi avec profil utilisateur
      const context = {
        conversationHistory,
        userProfile: message.conversation.participant,
      };

      // Générer une réponse selon le type de canal
      let generatedResponse: string;
      
      if (message.conversation.channel.type === 'LINKEDIN') {
        generatedResponse = await aiEngineService.generateLinkedInResponse(
          message.content,
          context
        );
      } else {
        generatedResponse = await aiEngineService.generateSupportResponse(
          message.content,
          context
        );
      }

      // Envoyer la réponse via Unipile
      await this.sendAIResponse(
        message.conversation.channel.providerAccountId,
        message.conversation.chatId,
        generatedResponse
      );

      logger.info('AI response sent successfully', {
        conversationId,
        messageId,
        responseLength: generatedResponse.length,
        channelType: message.conversation.channel.type
      });

    } catch (error) {
      logger.error('Error triggering AI response:', error);
      // Ne pas faire échouer le webhook pour une erreur d'IA
    }
  }

  /**
   * Envoyer une réponse IA via Unipile
   */
  private async sendAIResponse(accountId: string, chatId: string, content: string) {
    try {
      const result = await unipileService.sendMessage(chatId, content);
      
      if (result.success) {
        // Enregistrer le message envoyé dans la base de données
        await prisma.message.create({
          data: {
            id: result.data.id,
            conversationId: await this.getConversationIdFromChatId(chatId),
            content,
            direction: 'OUTBOUND',
            status: 'SENT',
            providerMessageId: result.data.id,
            metadata: {
              aiGenerated: true,
              model: 'gpt-4o',
              confidence: result.data.confidence || 0.8,
              generatedAt: new Date().toISOString()
            }
          }
        });

        logger.info('AI response saved to database', {
          messageId: result.data.id,
          chatId,
          contentLength: content.length
        });
      }
    } catch (error) {
      logger.error('Error sending AI response:', error);
      throw error;
    }
  }

  /**
   * Obtenir l'ID de conversation à partir du chat ID
   */
  private async getConversationIdFromChatId(chatId: string): Promise<string> {
    const conversation = await prisma.conversation.findFirst({
      where: { chatId },
      select: { id: true }
    });
    
    return conversation?.id || '';
  }
} 