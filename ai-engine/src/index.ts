import path from 'path';
import { config } from 'dotenv';
config({ path: path.join(process.cwd(), '..', 'default.env') });
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { logger } from './utils/logger';
import { AIOrchestrator } from './aiOrchestrator';
import { validateEnv } from './utils/environment';

const app = express();
const port = process.env.PORT || 3001;

// Initialize AI Orchestrator
const aiOrchestrator = new AIOrchestrator();

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'ai-engine',
    version: process.env.npm_package_version || '1.0.0',
  });
});

// Process message endpoint
app.post('/process-message', async (req, res) => {
  try {
    const { message, agentConfig, context } = req.body;

    if (!message || !agentConfig) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: message and agentConfig'
      });
    }

    logger.info('Processing message request', { 
      messageLength: message.length, 
      agentType: agentConfig.type 
    });

    const result = await aiOrchestrator.processMessage({
      message,
      agentConfig,
      context
    });

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    logger.error('Error processing message:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
});

// Generate personalized message endpoint
app.post('/generate-message', async (req, res) => {
  try {
    const { context, agentConfig } = req.body;

    if (!context) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: context'
      });
    }

    logger.info('Generating personalized message', { 
      prospectName: context.prospect?.name,
      campaignTemplate: context.campaign?.template?.substring(0, 50) + '...'
    });

    // Construire le prompt pour la génération de message personnalisé
    const systemPrompt = this.buildPersonalizedMessagePrompt(context);
    
    const messagePrompt = `Génère un message personnalisé pour ${context.prospect.name} en utilisant ces informations :

PROFIL DU PROSPECT :
- Nom : ${context.prospect.name}
- Poste : ${context.prospect.position || 'Non spécifié'}
- Entreprise : ${context.prospect.company || 'Non spécifiée'}
- Localisation : ${context.prospect.location || 'Non spécifiée'}
- Secteur : ${context.prospect.industry || 'Non spécifié'}
- Headline : ${context.prospect.headline || 'Non spécifié'}
- Expériences récentes : ${context.prospect.experience?.map(exp => `${exp.title} chez ${exp.company}`).join(', ') || 'Non spécifiées'}
- Compétences : ${context.prospect.skills?.join(', ') || 'Non spécifiées'}

TEMPLATE DE CAMPAGNE :
${context.campaign.template}

AUDIENCE CIBLE :
${JSON.stringify(context.campaign.targetAudience, null, 2)}

PROFIL DE L'EXPÉDITEUR :
- Profil : ${JSON.stringify(context.sender.profile, null, 2)}
- Business : ${JSON.stringify(context.sender.business, null, 2)}
- Style de communication : ${JSON.stringify(context.sender.communicationStyle, null, 2)}

Instructions :
1. Personnalise le message en utilisant les informations du prospect
2. Mentionne spécifiquement leur poste, entreprise ou expérience pertinente
3. Adapte le ton selon le style de communication configuré
4. Garde le message concis (max 200 mots)
5. Inclus un appel à l'action clair
6. Sois authentique et professionnel

Génère uniquement le message final, sans explications supplémentaires.`;

    const result = await aiOrchestrator.processMessage({
      message: messagePrompt,
      agentConfig: {
        type: 'SALES',
        model: agentConfig?.model || 'gpt-4o',
        temperature: agentConfig?.temperature || 0.7,
        maxTokens: agentConfig?.maxTokens || 300,
        prompt: systemPrompt
      },
      context: {
        channelType: 'linkedin',
        metadata: {
          prospect: context.prospect,
          campaign: context.campaign,
          sender: context.sender
        }
      }
    });

    res.json({
      success: true,
      message: result.response
    });
  } catch (error) {
    logger.error('Error generating personalized message:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
});

// Build personalized message prompt
function buildPersonalizedMessagePrompt(context: any): string {
  const { prospect, sender, aiParameters } = context;
  
  return `Tu es un expert en prospection LinkedIn spécialisé dans la génération de messages personnalisés avec un taux d'ouverture optimal.

TON RÔLE :
- Analyser le profil LinkedIn du prospect pour identifier les points de connexion
- Générer des messages personnalisés qui résonnent avec leur expérience
- Optimiser pour un taux d'ouverture élevé en utilisant des techniques éprouvées
- Adapter le ton selon le style de communication configuré

TECHNIQUES D'OPTIMISATION DU TAUX D'OUVERTURE :
1. **Personnalisation authentique** : Mentionner spécifiquement leur poste, entreprise ou expérience
2. **Valeur immédiate** : Proposer quelque chose de concret dès le premier message
3. **Curiosité** : Créer de l'intérêt sans tout révéler
4. **Urgence sociale** : Mentionner des tendances ou opportunités actuelles
5. **Preuve sociale** : Référencer des succès similaires (si pertinent)

STYLE DE COMMUNICATION CONFIGURÉ :
${JSON.stringify(sender.communicationStyle, null, 2)}

PARAMÈTRES IA :
- Température : ${aiParameters?.temperature || 0.7}
- Créativité : ${aiParameters?.creativity || 'modérée'}
- Longueur : ${aiParameters?.length || 'courte'}

RÈGLES STRICTES :
- Maximum 200 mots
- Toujours personnalisé selon le profil
- Inclure un appel à l'action clair
- Être authentique et professionnel
- Éviter les messages génériques ou spammy`;
}

// Sentiment analysis endpoint
app.post('/analyze-sentiment', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: message'
      });
    }

    const result = await aiOrchestrator.analyzeSentiment(message);

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    logger.error('Error analyzing sentiment:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
});

// Intent classification endpoint
app.post('/classify-intent', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: message'
      });
    }

    const result = await aiOrchestrator.classifyIntent(message);

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    logger.error('Error classifying intent:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
});

// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start server
app.listen(port, () => {
  logger.info(`🚀 AI Engine server running on port ${port}`);
  console.log(`🤖 AI Engine started on http://localhost:${port}`);
  console.log(`📊 Health check: http://localhost:${port}/health`);
});

export default app; 