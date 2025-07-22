import { Request, Response } from 'express';
import { getPrisma } from '../config/database';
import { logger } from '../utils/logger';
import { UnipileService } from '../services/unipile.service';
import { UnipileCredentials } from '../types/unipile';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// Prisma will be imported via getPrisma() when needed
const unipileService = new UnipileService();

export class ChannelsController {
  
  /**
   * Connecter un nouveau canal via Unipile
   */
  async connectChannel(req: AuthenticatedRequest, res: Response) {
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
  async listChannels(req: AuthenticatedRequest, res: Response) {
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
  async getChannel(req: AuthenticatedRequest, res: Response) {
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
      const unipileAccountId = (channel.metadata && typeof channel.metadata === 'object' && 'unipile_account_id' in channel.metadata) 
        ? (channel.metadata as any).unipile_account_id 
        : null;
      if (unipileAccountId) {
        const unipileResult = await unipileService.getAccount(unipileAccountId);
        if (unipileResult.success) {
          unipileStatus = unipileResult.data;
        }
      }

      res.json({
        success: true,
        data: {
          ...channel,
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
   * Synchroniser un canal
   */
  async syncChannel(req: AuthenticatedRequest, res: Response) {
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

      // Vérifier que le canal est actif
      if (!channel.isActive) {
        return res.status(400).json({
          success: false,
          error: { message: 'Channel is not active' }
        });
      }

      // Déclencher la synchronisation
      const syncResult = await this.performChannelSync(channel);

      if (syncResult.success) {
        res.json({
          success: true,
          message: 'Channel synchronized successfully',
          data: syncResult.data
        });
      } else {
        res.status(400).json({
          success: false,
          error: { message: 'Sync failed', details: syncResult.error }
        });
      }

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
  async disconnectChannel(req: AuthenticatedRequest, res: Response) {
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

      // Désactiver le canal
      await prisma.channel.update({
        where: { id: channelId },
        data: { isActive: false }
      });

      // Déconnecter du service Unipile si applicable
      const unipileAccountId = (channel.metadata && typeof channel.metadata === 'object' && 'unipile_account_id' in channel.metadata) 
        ? (channel.metadata as any).unipile_account_id 
        : null;
      if (unipileAccountId) {
        await unipileService.disconnectAccount(unipileAccountId);
      }

      logger.info(`Channel disconnected: ${channelId}`, { userId });

      res.json({
        success: true,
        message: 'Channel disconnected successfully'
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
  async getChannelConversations(req: AuthenticatedRequest, res: Response) {
    try {
      const { channelId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: { message: 'Authentication required' }
        });
      }

      const conversations = await prisma.conversation.findMany({
        where: {
          channelId,
          channel: {
            userId
          }
        },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
            take: 10 // Limiter les messages pour éviter la surcharge
          },
          _count: {
            select: {
              messages: true
            }
          }
        },
        orderBy: { updatedAt: 'desc' }
      });

      res.json({
        success: true,
        data: conversations
      });

    } catch (error) {
      logger.error('Error getting channel conversations:', error);
      res.status(500).json({
        success: false,
        error: { message: 'Internal server error' }
      });
    }
  }

  // Méthodes privées

  private async encryptCredentials(credentials: any): Promise<any> {
    // TODO: Implémenter le chiffrement des credentials
    return credentials;
  }

  private async triggerInitialSync(channelId: string, unipileAccountId: string): Promise<void> {
    // TODO: Implémenter la synchronisation initiale
    logger.info('Initial sync triggered', { channelId, unipileAccountId });
  }

  private async performChannelSync(channel: any): Promise<{ success: boolean; data?: any; error?: string }> {
    // TODO: Implémenter la synchronisation
    return { success: true, data: { syncedAt: new Date() } };
  }
} 