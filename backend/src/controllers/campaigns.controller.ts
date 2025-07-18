import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ProspectEnrichmentService } from '../services/prospect-enrichment.service';
import { logger } from '../utils/logger';

// Mock data for testing without database
const mockCampaigns = [
  {
    id: '1',
    name: 'Prospection CTOs Paris',
    description: 'Campagne de prospection des CTOs dans la région parisienne',
    status: 'DRAFT',
    type: 'LINKEDIN',
    totalProspects: 0,
    sentCount: 0,
    openedCount: 0,
    repliedCount: 0,
    createdAt: new Date().toISOString(),
    _count: { prospects: 0 }
  }
];

let prisma: PrismaClient | null = null;
let enrichmentService: ProspectEnrichmentService | null = null;

// Initialize Prisma only if database is available
try {
  prisma = new PrismaClient();
  enrichmentService = new ProspectEnrichmentService();
} catch (error) {
  logger.warn('Prisma initialization failed, using mock mode');
}

export class CampaignsController {
  /**
   * Créer une nouvelle campagne
   */
  async createCampaign(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id || 'mock-user-id';
      
      const {
        name,
        description,
        type = 'LINKEDIN',
        targetAudience,
        messageTemplate,
        aiConfig,
        dailyLimit = 50,
        delayBetweenMessages = 5000,
        sendTimeStart,
        sendTimeEnd
      } = req.body;

      if (!name || !messageTemplate) {
        return res.status(400).json({
          success: false,
          error: 'Name and messageTemplate are required'
        });
      }

      let campaign;
      
      if (prisma) {
        // Use real database if available
        campaign = await prisma.campaign.create({
          data: {
            userId,
            name,
            description,
            type,
            targetAudience: targetAudience || {},
            messageTemplate,
            aiConfig: aiConfig || {},
            dailyLimit,
            delayBetweenMessages,
            sendTimeStart,
            sendTimeEnd
          }
        });
      } else {
        // Use mock data
        campaign = {
          id: Date.now().toString(),
          userId,
          name,
          description,
          type,
          targetAudience: targetAudience || {},
          messageTemplate,
          aiConfig: aiConfig || {},
          dailyLimit,
          delayBetweenMessages,
          sendTimeStart,
          sendTimeEnd,
          status: 'DRAFT',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        mockCampaigns.push({
          id: campaign.id,
          name: campaign.name,
          description: campaign.description,
          status: 'DRAFT',
          type: campaign.type,
          totalProspects: 0,
          sentCount: 0,
          openedCount: 0,
          repliedCount: 0,
          createdAt: campaign.createdAt.toISOString(),
          _count: { prospects: 0 }
        });
      }

      logger.info('Campaign created', { campaignId: campaign.id, userId });

      res.status(201).json({
        success: true,
        data: campaign
      });
    } catch (error) {
      logger.error('Error creating campaign:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Lister les campagnes d'un utilisateur
   */
  async getCampaigns(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id || 'mock-user-id';
      
      const { page = 1, limit = 10, status } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      let campaigns, total;
      
      if (prisma) {
        // Use real database if available
        const where: any = { userId };
        if (status) {
          where.status = status;
        }

        [campaigns, total] = await Promise.all([
          prisma.campaign.findMany({
            where,
            include: {
              _count: {
                select: { prospects: true }
              }
            },
            skip,
            take: Number(limit),
            orderBy: { createdAt: 'desc' }
          }),
          prisma.campaign.count({ where })
        ]);
      } else {
        // Use mock data
        campaigns = mockCampaigns.slice(skip, skip + Number(limit));
        total = mockCampaigns.length;
      }

      res.json({
        success: true,
        data: campaigns,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      logger.error('Error fetching campaigns:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Obtenir une campagne spécifique
   */
  async getCampaign(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const { id } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized'
        });
      }

      const campaign = await prisma.campaign.findFirst({
        where: {
          id,
          userId
        },
        include: {
          prospects: {
            orderBy: { createdAt: 'desc' },
            take: 50
          },
          _count: {
            select: { prospects: true }
          }
        }
      });

      if (!campaign) {
        return res.status(404).json({
          success: false,
          error: 'Campaign not found'
        });
      }

      res.json({
        success: true,
        data: campaign
      });
    } catch (error) {
      logger.error('Error fetching campaign:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Mettre à jour une campagne
   */
  async updateCampaign(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const { id } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized'
        });
      }

      const campaign = await prisma.campaign.findFirst({
        where: { id, userId }
      });

      if (!campaign) {
        return res.status(404).json({
          success: false,
          error: 'Campaign not found'
        });
      }

      const updatedCampaign = await prisma.campaign.update({
        where: { id },
        data: req.body
      });

      logger.info('Campaign updated', { campaignId: id, userId });

      res.json({
        success: true,
        data: updatedCampaign
      });
    } catch (error) {
      logger.error('Error updating campaign:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Supprimer une campagne
   */
  async deleteCampaign(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const { id } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized'
        });
      }

      const campaign = await prisma.campaign.findFirst({
        where: { id, userId }
      });

      if (!campaign) {
        return res.status(404).json({
          success: false,
          error: 'Campaign not found'
        });
      }

      await prisma.campaign.delete({
        where: { id }
      });

      logger.info('Campaign deleted', { campaignId: id, userId });

      res.json({
        success: true,
        message: 'Campaign deleted successfully'
      });
    } catch (error) {
      logger.error('Error deleting campaign:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Ajouter des prospects à une campagne
   */
  async addProspects(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const { id: campaignId } = req.params;
      const { prospects } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized'
        });
      }

      if (!prospects || !Array.isArray(prospects)) {
        return res.status(400).json({
          success: false,
          error: 'Prospects array is required'
        });
      }

      // Vérifier que la campagne appartient à l'utilisateur
      const campaign = await prisma.campaign.findFirst({
        where: { id: campaignId, userId }
      });

      if (!campaign) {
        return res.status(404).json({
          success: false,
          error: 'Campaign not found'
        });
      }

      // Créer les prospects
      const createdProspects = [];
      for (const prospectData of prospects) {
        try {
          const prospect = await prisma.prospect.create({
            data: {
              campaignId,
              userId,
              firstName: prospectData.firstName,
              lastName: prospectData.lastName,
              email: prospectData.email,
              phone: prospectData.phone,
              linkedinUrl: prospectData.linkedinUrl,
              linkedinId: prospectData.linkedinId,
              company: prospectData.company,
              position: prospectData.position,
              location: prospectData.location,
              industry: prospectData.industry
            }
          });
          createdProspects.push(prospect);
        } catch (error) {
          logger.error('Error creating prospect', { prospectData, error: error.message });
        }
      }

      // Mettre à jour le nombre total de prospects
      await prisma.campaign.update({
        where: { id: campaignId },
        data: {
          totalProspects: {
            increment: createdProspects.length
          }
        }
      });

      logger.info('Prospects added to campaign', { 
        campaignId, 
        added: createdProspects.length,
        total: prospects.length 
      });

      res.status(201).json({
        success: true,
        data: {
          added: createdProspects.length,
          total: prospects.length,
          prospects: createdProspects
        }
      });
    } catch (error) {
      logger.error('Error adding prospects:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Enrichir les prospects d'une campagne
   */
  async enrichProspects(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const { id: campaignId } = req.params;
      const { accountId, limit = 10 } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized'
        });
      }

      if (!accountId) {
        return res.status(400).json({
          success: false,
          error: 'accountId is required'
        });
      }

      // Vérifier que la campagne appartient à l'utilisateur
      const campaign = await prisma.campaign.findFirst({
        where: { id: campaignId, userId }
      });

      if (!campaign) {
        return res.status(404).json({
          success: false,
          error: 'Campaign not found'
        });
      }

      // Démarrer l'enrichissement en arrière-plan
      enrichmentService.processProspectBatch(campaignId, accountId, limit);

      logger.info('Prospect enrichment started', { campaignId, accountId, limit });

      res.json({
        success: true,
        message: 'Prospect enrichment started',
        data: {
          campaignId,
          accountId,
          limit
        }
      });
    } catch (error) {
      logger.error('Error starting prospect enrichment:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Démarrer une campagne
   */
  async startCampaign(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const { id: campaignId } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized'
        });
      }

      const campaign = await prisma.campaign.findFirst({
        where: { id: campaignId, userId }
      });

      if (!campaign) {
        return res.status(404).json({
          success: false,
          error: 'Campaign not found'
        });
      }

      if (campaign.status === 'ACTIVE') {
        return res.status(400).json({
          success: false,
          error: 'Campaign is already active'
        });
      }

      const updatedCampaign = await prisma.campaign.update({
        where: { id: campaignId },
        data: {
          status: 'ACTIVE',
          startedAt: new Date()
        }
      });

      logger.info('Campaign started', { campaignId, userId });

      res.json({
        success: true,
        data: updatedCampaign
      });
    } catch (error) {
      logger.error('Error starting campaign:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Arrêter une campagne
   */
  async stopCampaign(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const { id: campaignId } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized'
        });
      }

      const campaign = await prisma.campaign.findFirst({
        where: { id: campaignId, userId }
      });

      if (!campaign) {
        return res.status(404).json({
          success: false,
          error: 'Campaign not found'
        });
      }

      const updatedCampaign = await prisma.campaign.update({
        where: { id: campaignId },
        data: {
          status: 'PAUSED',
          endedAt: new Date()
        }
      });

      logger.info('Campaign stopped', { campaignId, userId });

      res.json({
        success: true,
        data: updatedCampaign
      });
    } catch (error) {
      logger.error('Error stopping campaign:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Obtenir les statistiques d'une campagne
   */
  async getCampaignStats(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const { id: campaignId } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized'
        });
      }

      const campaign = await prisma.campaign.findFirst({
        where: { id: campaignId, userId },
        include: {
          prospects: {
            select: {
              status: true,
              score: true,
              sentAt: true,
              openedAt: true,
              repliedAt: true
            }
          }
        }
      });

      if (!campaign) {
        return res.status(404).json({
          success: false,
          error: 'Campaign not found'
        });
      }

      // Calculer les statistiques
      const stats = {
        total: campaign.prospects.length,
        pending: campaign.prospects.filter(p => p.status === 'PENDING').length,
        qualified: campaign.prospects.filter(p => p.status === 'QUALIFIED').length,
        contacted: campaign.prospects.filter(p => p.status === 'CONTACTED').length,
        responded: campaign.prospects.filter(p => p.status === 'RESPONDED').length,
        converted: campaign.prospects.filter(p => p.status === 'CONVERTED').length,
        averageScore: campaign.prospects.reduce((sum, p) => sum + p.score, 0) / campaign.prospects.length || 0,
        openRate: campaign.prospects.filter(p => p.openedAt).length / campaign.prospects.filter(p => p.sentAt).length || 0,
        replyRate: campaign.prospects.filter(p => p.repliedAt).length / campaign.prospects.filter(p => p.sentAt).length || 0
      };

      res.json({
        success: true,
        data: {
          campaign,
          stats
        }
      });
    } catch (error) {
      logger.error('Error fetching campaign stats:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
} 