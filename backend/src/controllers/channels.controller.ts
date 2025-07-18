import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';
import { UnipileService } from '../services/unipile.service';
import { UnipileCredentials } from '../types/unipile';

const prisma = new PrismaClient();
const unipileService = new UnipileService();

export class ChannelsController {
  
  /**
   * Connecter un nouveau canal via Unipile
   */
  async connectChannel(req: Request, res: Response) {
    try {
      const { name, type, provider, credentials, settings } = req.body;
      const userId = req.user?.id; // Assumant qu'on a un middleware d'auth

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: { message: 'Authentication required' }
        });
      }

      // Valider les données d'entrée
      if (!name || !type || !provider || !credentials) {
        return res.status(400).json({
          success: false,
          error: { message: 'Missing required fields: name, type, provider, credentials' }
        });
      }

      // Préparer les credentials pour Unipile
      const unipileCredentials: UnipileCredentials = {
        account_id: credentials.account_id || `${type}_${Date.now()}`,
        type: type.toUpperCase(),
        credentials: credentials
      };

      // Connecter le compte via Unipile
      const unipileResult = await unipileService.connectAccount(unipileCredentials);
      
      if (!unipileResult.success) {
        logger.error('Failed to connect account to Unipile:', unipileResult.error);
        return res.status(400).json({
          success: false,
          error: {
            message: 'Failed to connect to Unipile',
            details: unipileResult.error
          }
        });
      }

      // Chiffrer les credentials avant de les stocker
      const encryptedCredentials = await this.encryptCredentials(credentials);

      // Créer le canal dans la base de données
      const channel = await prisma.channel.create({
        data: {
          userId,
          name,
          type: type.toUpperCase(),
          provider,
          isActive: true,
          credentials: encryptedCredentials,
          settings: settings || {},
          metadata: {
            unipile_account_id: unipileResult.data?.id,
            connected_at: new Date().toISOString()
          }
        }
      });

      // Déclencher la synchronisation initiale si c'est LinkedIn
      if (type.toUpperCase() === 'LINKEDIN') {
        await this.triggerInitialSync(channel.id, unipileResult.data?.id);
      }

      logger.info(`Channel connected successfully: ${channel.id}`, {
        userId,
        channelType: type,
        provider
      });

      res.status(201).json({
        success: true,
        data: {
          id: channel.id,
          name: channel.name,
          type: channel.type,
          provider: channel.provider,
          isActive: channel.isActive,
          createdAt: channel.createdAt
        }
      });

    } catch (error) {
      logger.error('Error connecting channel:', error);
      res.status(500).json({
        success: false,
        error: { message: 'Internal server error' }
      });
    }
  }

  /**
   * Lister tous les canaux de l'utilisateur
   */
  async listChannels(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: { message: 'Authentication required' }
        });
      }

      const channels = await prisma.channel.findMany({
        where: { userId },
        select: {
          id: true,
          name: true,
          type: true,
          provider: true,
          isActive: true,
          lastSyncAt: true,
          createdAt: true,
          updatedAt: true,
          metadata: true,
          _count: {
            select: {
              conversations: true,
              messages: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      res.json({
        success: true,
        data: channels
      });

    } catch (error) {
      logger.error('Error listing channels:', error);
      res.status(500).json({
        success: false,
        error: { message: 'Internal server error' }
      });
    }
  }

  /**
   * Obtenir les détails d'un canal spécifique
   */
  async getChannel(req: Request, res: Response) {
    try {
      const { channelId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: { message: 'Authentication required' }
        });
      }

      const channel = await prisma.channel.findFirst({
        where: {
          id: channelId,
          userId
        },
        include: {
          _count: {
            select: {
              conversations: true,
              messages: true
            }
          }
        }
      });

      if (!channel) {
        return res.status(404).json({
          success: false,
          error: { message: 'Channel not found' }
        });
      }

      // Obtenir le statut depuis Unipile si disponible
      let unipileStatus = null;
      const unipileAccountId = channel.metadata?.unipile_account_id;
      if (unipileAccountId) {
        const unipileResult = await unipileService.getAccount(unipileAccountId);
        if (unipileResult.success) {
          unipileStatus = unipileResult.data?.status;
        }
      }

      res.json({
        success: true,
        data: {
          ...channel,
          credentials: undefined, // Ne pas exposer les credentials
          unipileStatus
        }
      });

    } catch (error) {
      logger.error('Error getting channel:', error);
      res.status(500).json({
        success: false,
        error: { message: 'Internal server error' }
      });
    }
  }

  /**
   * Synchroniser un canal avec Unipile
   */
  async syncChannel(req: Request, res: Response) {
    try {
      const { channelId } = req.params;
      const { linkedin_product, before, after } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: { message: 'Authentication required' }
        });
      }

      const channel = await prisma.channel.findFirst({
        where: {
          id: channelId,
          userId
        }
      });

      if (!channel) {
        return res.status(404).json({
          success: false,
          error: { message: 'Channel not found' }
        });
      }

      const unipileAccountId = channel.metadata?.unipile_account_id;
      if (!unipileAccountId) {
        return res.status(400).json({
          success: false,
          error: { message: 'Channel not connected to Unipile' }
        });
      }

      // Déclencher la synchronisation
      const syncResult = await unipileService.syncAccount(unipileAccountId, {
        linkedin_product,
        before,
        after
      });

      if (!syncResult.success) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Synchronization failed',
            details: syncResult.error
          }
        });
      }

      // Mettre à jour la dernière synchronisation
      await prisma.channel.update({
        where: { id: channelId },
        data: { lastSyncAt: new Date() }
      });

      res.json({
        success: true,
        data: {
          message: 'Synchronization started',
          syncStatus: syncResult.data
        }
      });

    } catch (error) {
      logger.error('Error syncing channel:', error);
      res.status(500).json({
        success: false,
        error: { message: 'Internal server error' }
      });
    }
  }

  /**
   * Déconnecter un canal
   */
  async disconnectChannel(req: Request, res: Response) {
    try {
      const { channelId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: { message: 'Authentication required' }
        });
      }

      const channel = await prisma.channel.findFirst({
        where: {
          id: channelId,
          userId
        }
      });

      if (!channel) {
        return res.status(404).json({
          success: false,
          error: { message: 'Channel not found' }
        });
      }

      // Déconnecter de Unipile si connecté
      const unipileAccountId = channel.metadata?.unipile_account_id;
      if (unipileAccountId) {
        await unipileService.disconnectAccount(unipileAccountId);
      }

      // Désactiver le canal (ne pas le supprimer pour garder l'historique)
      await prisma.channel.update({
        where: { id: channelId },
        data: {
          isActive: false,
          metadata: {
            ...channel.metadata,
            disconnected_at: new Date().toISOString()
          }
        }
      });

      res.json({
        success: true,
        data: { message: 'Channel disconnected successfully' }
      });

    } catch (error) {
      logger.error('Error disconnecting channel:', error);
      res.status(500).json({
        success: false,
        error: { message: 'Internal server error' }
      });
    }
  }

  /**
   * Obtenir les conversations d'un canal
   */
  async getChannelConversations(req: Request, res: Response) {
    try {
      const { channelId } = req.params;
      const { page = 1, limit = 20 } = req.query;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: { message: 'Authentication required' }
        });
      }

      const channel = await prisma.channel.findFirst({
        where: {
          id: channelId,
          userId
        }
      });

      if (!channel) {
        return res.status(404).json({
          success: false,
          error: { message: 'Channel not found' }
        });
      }

      const conversations = await prisma.conversation.findMany({
        where: { channelId },
        include: {
          _count: {
            select: { messages: true }
          },
          messages: {
            take: 1,
            orderBy: { createdAt: 'desc' },
            select: {
              id: true,
              content: true,
              direction: true,
              createdAt: true
            }
          }
        },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { updatedAt: 'desc' }
      });

      const total = await prisma.conversation.count({
        where: { channelId }
      });

      res.json({
        success: true,
        data: conversations,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit))
        }
      });

    } catch (error) {
      logger.error('Error getting channel conversations:', error);
      res.status(500).json({
        success: false,
        error: { message: 'Internal server error' }
      });
    }
  }

  /**
   * Chiffrer les credentials (implémentation basique)
   */
  private async encryptCredentials(credentials: any): Promise<any> {
    // TODO: Implémenter un chiffrement réel avec une clé secrète
    // Pour le moment, on retourne les credentials tels quels
    return credentials;
  }

  /**
   * Déclencher la synchronisation initiale
   */
  private async triggerInitialSync(channelId: string, unipileAccountId: string): Promise<void> {
    try {
      // TODO: Ajouter la synchronisation à une queue pour traitement asynchrone
      logger.info(`Triggering initial sync for channel ${channelId} with Unipile account ${unipileAccountId}`);
      
      // Synchroniser les données des 30 derniers jours
      const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
      await unipileService.syncAccount(unipileAccountId, {
        after: thirtyDaysAgo
      });
      
    } catch (error) {
      logger.error('Error triggering initial sync:', error);
    }
  }
} 