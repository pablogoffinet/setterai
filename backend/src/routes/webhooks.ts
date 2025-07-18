import { Router } from 'express';
import { WebhooksController } from '../controllers/webhooks.controller';

const router = Router();
const webhooksController = new WebhooksController();

/**
 * @swagger
 * /webhooks/unipile:
 *   post:
 *     summary: Handle Unipile webhook events
 *     tags: [Webhooks]
 *     description: Endpoint to receive webhook events from Unipile API
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [MESSAGE_RECEIVED, MESSAGE_SENT, MESSAGE_STATUS_UPDATED, CHAT_UPDATED, ACCOUNT_DISCONNECTED]
 *                 description: Type of webhook event
 *               account_id:
 *                 type: string
 *                 description: Unipile account ID
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *                 description: Event timestamp
 *               data:
 *                 type: object
 *                 description: Event-specific data payload
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Invalid webhook signature
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Invalid signature"
 *       500:
 *         description: Internal server error
 */
router.post('/unipile', webhooksController.handleUnipileWebhook);

/**
 * @swagger
 * /webhooks/test:
 *   post:
 *     summary: Test webhook endpoint
 *     tags: [Webhooks]
 *     description: Test endpoint for webhook development
 *     responses:
 *       200:
 *         description: Test webhook received
 */
router.post('/test', (req, res) => {
  res.json({ 
    message: 'Test webhook received',
    timestamp: new Date().toISOString(),
    body: req.body,
  });
});

export default router; 