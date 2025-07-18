import { PrismaClient } from '@prisma/client';
import { LinkedInUnipileService } from './linkedin-unipile.service';
import { logger } from '../utils/logger';
import axios from 'axios';
import { environment } from '../config/environment';

const prisma = new PrismaClient();

export interface ProspectEnrichmentData {
  linkedinId?: string;
  linkedinUrl?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  company?: string;
  position?: string;
  location?: string;
  industry?: string;
  experience?: any[];
  education?: any[];
  skills?: string[];
  headline?: string;
  summary?: string;
  connectionsCount?: number;
  followerCount?: number;
}

export interface PersonalizedMessageData {
  prospect: ProspectEnrichmentData;
  campaign: {
    messageTemplate: string;
    aiConfig: any;
    targetAudience: any;
  };
  aiProfile: {
    userProfile: any;
    businessInfo: any;
    communicationStyle: any;
    messageTemplates: any;
    aiParameters: any;
  };
}

export class ProspectEnrichmentService {
  private linkedInService: LinkedInUnipileService;

  constructor() {
    this.linkedInService = new LinkedInUnipileService();
  }

  /**
   * Enrichir un prospect avec les données LinkedIn
   */
  async enrichProspect(prospectId: string, accountId: string): Promise<ProspectEnrichmentData | null> {
    try {
      logger.info('Starting prospect enrichment', { prospectId, accountId });

      // Récupérer le prospect depuis la base de données
      const prospect = await prisma.prospect.findUnique({
        where: { id: prospectId },
        include: { campaign: true }
      });

      if (!prospect) {
        throw new Error('Prospect not found');
      }

      // Si le profil a déjà été récupéré récemment (moins de 24h), on le réutilise
      if (prospect.profileFetchedAt && 
          Date.now() - prospect.profileFetchedAt.getTime() < 24 * 60 * 60 * 1000) {
        logger.info('Prospect profile already fetched recently, using cached data', { prospectId });
        return this.mapProspectToEnrichmentData(prospect);
      }

      let enrichmentData: ProspectEnrichmentData = {};

      // Essayer de récupérer le profil via l'URL LinkedIn
      if (prospect.linkedinUrl) {
        enrichmentData = await this.fetchProfileByUrl(prospect.linkedinUrl, accountId);
      }

      // Si pas d'URL ou échec, essayer via l'ID LinkedIn
      if (!enrichmentData.linkedinId && prospect.linkedinId) {
        enrichmentData = await this.fetchProfileById(prospect.linkedinId, accountId);
      }

      // Si toujours pas de données, essayer une recherche par nom/entreprise
      if (!enrichmentData.linkedinId && prospect.firstName && prospect.lastName) {
        enrichmentData = await this.searchProfileByName(
          `${prospect.firstName} ${prospect.lastName}`,
          prospect.company,
          accountId
        );
      }

      // Mettre à jour le prospect avec les données enrichies
      if (enrichmentData.linkedinId || enrichmentData.headline) {
        await this.updateProspectWithEnrichmentData(prospectId, enrichmentData);
        logger.info('Prospect enriched successfully', { prospectId, enrichmentData });
      }

      return enrichmentData;
    } catch (error) {
      logger.error('Error enriching prospect', { prospectId, error: error.message });
      return null;
    }
  }

  /**
   * Récupérer un profil via l'URL LinkedIn
   */
  private async fetchProfileByUrl(linkedinUrl: string, accountId: string): Promise<ProspectEnrichmentData> {
    try {
      // Extraire l'ID LinkedIn de l'URL
      const urlMatch = linkedinUrl.match(/linkedin\.com\/in\/([^\/\?]+)/);
      if (!urlMatch) {
        throw new Error('Invalid LinkedIn URL format');
      }

      const profileId = urlMatch[1];
      
      // Utiliser l'API Unipile pour récupérer le profil
      const response = await this.linkedInService.searchProfiles(accountId, {
        keywords: profileId,
        limit: 1
      });

      if (response.success && response.data?.length > 0) {
        return this.mapUnipileProfileToEnrichmentData(response.data[0]);
      }

      return {};
    } catch (error) {
      logger.error('Error fetching profile by URL', { linkedinUrl, error: error.message });
      return {};
    }
  }

  /**
   * Récupérer un profil via l'ID LinkedIn
   */
  private async fetchProfileById(linkedinId: string, accountId: string): Promise<ProspectEnrichmentData> {
    try {
      // Utiliser l'API Unipile pour récupérer le profil par ID
      const response = await this.linkedInService.searchProfiles(accountId, {
        keywords: linkedinId,
        limit: 1
      });

      if (response.success && response.data?.length > 0) {
        return this.mapUnipileProfileToEnrichmentData(response.data[0]);
      }

      return {};
    } catch (error) {
      logger.error('Error fetching profile by ID', { linkedinId, error: error.message });
      return {};
    }
  }

  /**
   * Rechercher un profil par nom et entreprise
   */
  private async searchProfileByName(
    fullName: string, 
    company: string | null, 
    accountId: string
  ): Promise<ProspectEnrichmentData> {
    try {
      const searchQuery = company ? `${fullName} ${company}` : fullName;
      
      const response = await this.linkedInService.searchProfiles(accountId, {
        keywords: searchQuery,
        limit: 5
      });

      if (response.success && response.data?.length > 0) {
        // Prendre le premier résultat qui correspond le mieux
        return this.mapUnipileProfileToEnrichmentData(response.data[0]);
      }

      return {};
    } catch (error) {
      logger.error('Error searching profile by name', { fullName, company, error: error.message });
      return {};
    }
  }

  /**
   * Mapper les données Unipile vers notre format d'enrichissement
   */
  private mapUnipileProfileToEnrichmentData(profile: any): ProspectEnrichmentData {
    return {
      linkedinId: profile.id,
      linkedinUrl: profile.public_url || profile.linkedin_url,
      firstName: profile.first_name,
      lastName: profile.last_name,
      headline: profile.headline,
      summary: profile.summary,
      company: profile.current_company || profile.company,
      position: profile.current_position || profile.title,
      location: profile.location?.name,
      industry: profile.industry,
      experience: profile.experience || [],
      education: profile.education || [],
      skills: profile.skills || [],
      connectionsCount: profile.connections_count,
      followerCount: profile.follower_count
    };
  }

  /**
   * Mapper les données du prospect vers le format d'enrichissement
   */
  private mapProspectToEnrichmentData(prospect: any): ProspectEnrichmentData {
    return {
      linkedinId: prospect.linkedinId,
      linkedinUrl: prospect.linkedinUrl,
      firstName: prospect.firstName,
      lastName: prospect.lastName,
      headline: prospect.headline,
      company: prospect.company,
      position: prospect.position,
      location: prospect.location,
      industry: prospect.industry,
      experience: prospect.experience || [],
      education: prospect.education || [],
      skills: prospect.skills || []
    };
  }

  /**
   * Mettre à jour le prospect avec les données enrichies
   */
  private async updateProspectWithEnrichmentData(prospectId: string, enrichmentData: ProspectEnrichmentData) {
    await prisma.prospect.update({
      where: { id: prospectId },
      data: {
        linkedinId: enrichmentData.linkedinId,
        linkedinUrl: enrichmentData.linkedinUrl,
        headline: enrichmentData.headline,
        company: enrichmentData.company,
        position: enrichmentData.position,
        location: enrichmentData.location,
        industry: enrichmentData.industry,
        experience: enrichmentData.experience,
        education: enrichmentData.education,
        skills: enrichmentData.skills,
        profileFetchedAt: new Date(),
        updatedAt: new Date()
      }
    });
  }

  /**
   * Générer un message personnalisé pour un prospect
   */
  async generatePersonalizedMessage(data: PersonalizedMessageData): Promise<string> {
    try {
      logger.info('Generating personalized message', { 
        prospectName: `${data.prospect.firstName} ${data.prospect.lastName}`,
        campaignId: data.campaign.messageTemplate.substring(0, 50) + '...'
      });

      // Préparer le contexte pour l'IA
      const context = this.buildMessageContext(data);

      // Appeler l'AI Engine pour générer le message
      const aiResponse = await this.callAIEngine(context);

      if (aiResponse.success && aiResponse.message) {
        logger.info('Personalized message generated successfully', { 
          messageLength: aiResponse.message.length 
        });
        return aiResponse.message;
      }

      // Fallback vers le template de base si l'IA échoue
      return this.generateFallbackMessage(data);
    } catch (error) {
      logger.error('Error generating personalized message', { error: error.message });
      return this.generateFallbackMessage(data);
    }
  }

  /**
   * Construire le contexte pour la génération de message
   */
  private buildMessageContext(data: PersonalizedMessageData): any {
    const prospect = data.prospect;
    const campaign = data.campaign;
    const aiProfile = data.aiProfile;

    return {
      prospect: {
        name: `${prospect.firstName} ${prospect.lastName}`,
        headline: prospect.headline,
        company: prospect.company,
        position: prospect.position,
        location: prospect.location,
        industry: prospect.industry,
        experience: prospect.experience?.slice(0, 3), // 3 dernières expériences
        skills: prospect.skills?.slice(0, 5), // 5 compétences principales
        summary: prospect.summary
      },
      campaign: {
        template: campaign.messageTemplate,
        targetAudience: campaign.targetAudience
      },
      sender: {
        profile: aiProfile.userProfile,
        business: aiProfile.businessInfo,
        communicationStyle: aiProfile.communicationStyle
      },
      aiParameters: aiProfile.aiParameters
    };
  }

  /**
   * Appeler l'AI Engine pour générer le message
   */
  private async callAIEngine(context: any): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const response = await axios.post(`${environment.AI_ENGINE_URL}/generate-message`, {
        context,
        agentConfig: {
          type: 'SALES',
          model: 'gpt-4o',
          temperature: 0.7,
          maxTokens: 300
        }
      }, {
        timeout: 30000
      });

      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      logger.error('Error calling AI Engine', { error: error.message });
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Générer un message de fallback si l'IA échoue
   */
  private generateFallbackMessage(data: PersonalizedMessageData): string {
    const prospect = data.prospect;
    const template = data.campaign.messageTemplate;

    // Remplacer les variables dans le template
    let message = template
      .replace('{{firstName}}', prospect.firstName || '')
      .replace('{{lastName}}', prospect.lastName || '')
      .replace('{{company}}', prospect.company || '')
      .replace('{{position}}', prospect.position || '')
      .replace('{{location}}', prospect.location || '');

    // Ajouter une personnalisation basique basée sur l'industrie
    if (prospect.industry) {
      message += `\n\nJe vois que vous travaillez dans le secteur ${prospect.industry}. `;
    }

    return message;
  }

  /**
   * Qualifier un prospect avec un score
   */
  async qualifyProspect(prospectId: string): Promise<number> {
    try {
      const prospect = await prisma.prospect.findUnique({
        where: { id: prospectId },
        include: { campaign: true }
      });

      if (!prospect) {
        return 0;
      }

      let score = 0;

      // Score basé sur la complétude du profil
      if (prospect.headline) score += 0.2;
      if (prospect.company) score += 0.2;
      if (prospect.position) score += 0.2;
      if (prospect.experience && Array.isArray(prospect.experience) && prospect.experience.length > 0) score += 0.2;
      if (prospect.skills && prospect.skills.length > 0) score += 0.2;

      // Score basé sur la correspondance avec l'audience cible
      const targetAudience = prospect.campaign.targetAudience as any;
      if (targetAudience) {
        if (targetAudience.industries && targetAudience.industries.includes(prospect.industry)) {
          score += 0.3;
        }
        if (targetAudience.locations && targetAudience.locations.includes(prospect.location)) {
          score += 0.2;
        }
        if (targetAudience.positions && targetAudience.positions.some((pos: string) => 
          prospect.position?.toLowerCase().includes(pos.toLowerCase()))) {
          score += 0.3;
        }
      }

      // Mettre à jour le score du prospect
      await prisma.prospect.update({
        where: { id: prospectId },
        data: { 
          score: Math.min(score, 1.0),
          status: score > 0.7 ? 'QUALIFIED' : 'PENDING'
        }
      });

      return Math.min(score, 1.0);
    } catch (error) {
      logger.error('Error qualifying prospect', { prospectId, error: error.message });
      return 0;
    }
  }

  /**
   * Traiter un lot de prospects pour enrichissement
   */
  async processProspectBatch(campaignId: string, accountId: string, limit: number = 10): Promise<void> {
    try {
      logger.info('Processing prospect batch for enrichment', { campaignId, limit });

      // Récupérer les prospects non enrichis
      const prospects = await prisma.prospect.findMany({
        where: {
          campaignId,
          profileFetchedAt: null,
          status: 'PENDING'
        },
        take: limit
      });

      for (const prospect of prospects) {
        try {
          // Enrichir le prospect
          await this.enrichProspect(prospect.id, accountId);
          
          // Qualifier le prospect
          await this.qualifyProspect(prospect.id);
          
          // Générer le message personnalisé
          await this.generateAndStorePersonalizedMessage(prospect.id);
          
          // Délai pour éviter de surcharger l'API LinkedIn
          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
          logger.error('Error processing prospect', { prospectId: prospect.id, error: error.message });
        }
      }

      logger.info('Prospect batch processing completed', { 
        campaignId, 
        processed: prospects.length 
      });
    } catch (error) {
      logger.error('Error processing prospect batch', { campaignId, error: error.message });
    }
  }

  /**
   * Générer et stocker le message personnalisé pour un prospect
   */
  private async generateAndStorePersonalizedMessage(prospectId: string): Promise<void> {
    try {
      const prospect = await prisma.prospect.findUnique({
        where: { id: prospectId },
        include: { 
          campaign: { 
            include: { 
              user: { 
                include: { 
                  aiProfiles: { 
                    where: { isActive: true },
                    take: 1 
                  } 
                } 
              } 
            } 
          } 
        }
      });

      if (!prospect || !prospect.campaign.user.aiProfiles[0]) {
        return;
      }

      const aiProfile = prospect.campaign.user.aiProfiles[0];
      const enrichmentData = this.mapProspectToEnrichmentData(prospect);

      const messageData: PersonalizedMessageData = {
        prospect: enrichmentData,
        campaign: {
          messageTemplate: prospect.campaign.messageTemplate,
          aiConfig: prospect.campaign.aiConfig,
          targetAudience: prospect.campaign.targetAudience
        },
        aiProfile: {
          userProfile: aiProfile.userProfile,
          businessInfo: aiProfile.businessInfo,
          communicationStyle: aiProfile.communicationStyle,
          messageTemplates: aiProfile.messageTemplates,
          aiParameters: aiProfile.aiParameters
        }
      };

      const personalizedMessage = await this.generatePersonalizedMessage(messageData);

      // Stocker le message personnalisé
      await prisma.prospect.update({
        where: { id: prospectId },
        data: { personalizedMessage }
      });

      logger.info('Personalized message stored for prospect', { prospectId });
    } catch (error) {
      logger.error('Error generating and storing personalized message', { 
        prospectId, 
        error: error.message 
      });
    }
  }
} 