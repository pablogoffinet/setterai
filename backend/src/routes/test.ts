import { Router } from 'express';
import { UnipileService } from '../services/unipile.service';
import { AIEngineService } from '../services/ai-engine.service';

const router = Router();
const unipileService = new UnipileService();
const aiEngineService = new AIEngineService();

// Test des comptes Unipile connectés
router.get('/unipile/accounts', async (req, res) => {
  try {
    const accounts = await unipileService.listAccounts();
    res.json({
      success: true,
      data: accounts.data || [],
      count: accounts.data?.length || 0
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch Unipile accounts', details: error }
    });
  }
});

// Test simple
router.get('/hello', (req, res) => {
  res.json({
    success: true,
    message: 'Test endpoint working!',
    timestamp: new Date().toISOString()
  });
});

// Test de l'AI Engine
router.get('/ai-engine/health', async (req, res) => {
  try {
    const isHealthy = await aiEngineService.healthCheck();
    res.json({
      success: true,
      data: {
        aiEngineHealthy: isHealthy,
        aiEngineUrl: process.env.AI_ENGINE_URL || 'http://localhost:3000'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'AI Engine health check failed', details: error }
    });
  }
});

// Test de traitement de message avec l'AI Engine
router.post('/ai-engine/process', async (req, res) => {
  try {
    const { message, agentType = 'SALES' } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        error: { message: 'Message is required' }
      });
    }

    const result = await aiEngineService.processMessage({
      message,
      agentConfig: {
        type: agentType as 'CUSTOMER_SUPPORT' | 'SALES' | 'MARKETING' | 'CUSTOM',
        temperature: 0.7,
        maxTokens: 500
      },
      context: {
        conversationHistory: [],
        channelType: 'LINKEDIN'
      }
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'AI processing failed', details: error }
    });
  }
});

export default router; 