import { Router } from 'express';
import { CampaignsController } from '../controllers/campaigns.controller';

const router = Router();
const campaignsController = new CampaignsController();

// Routes pour les campagnes
router.post('/', campaignsController.createCampaign.bind(campaignsController));
router.get('/', campaignsController.getCampaigns.bind(campaignsController));
router.get('/:id', campaignsController.getCampaign.bind(campaignsController));
router.put('/:id', campaignsController.updateCampaign.bind(campaignsController));
router.delete('/:id', campaignsController.deleteCampaign.bind(campaignsController));

// Routes pour les prospects
router.post('/:id/prospects', campaignsController.addProspects.bind(campaignsController));
router.post('/:id/enrich', campaignsController.enrichProspects.bind(campaignsController));

// Routes pour le contrôle des campagnes
router.post('/:id/start', campaignsController.startCampaign.bind(campaignsController));
router.post('/:id/stop', campaignsController.stopCampaign.bind(campaignsController));

// Routes pour les statistiques
router.get('/:id/stats', campaignsController.getCampaignStats.bind(campaignsController));

export default router; 