import { Router } from 'express';
import { ChannelsController } from '../controllers/channels.controller';
import { authenticateToken } from '../middleware/auth';
import { UnipileService } from '../services/unipile.service';

const router = Router();
const channelsController = new ChannelsController();
const unipileService = new UnipileService();

// Route de test pour voir les comptes Unipile
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
      error: { message: 'Failed to fetch Unipile accounts' }
    });
  }
});

/**
 * @swagger
 * /channels:
 *   post:
 *     summary: Connect a new channel via Unipile
 *     tags: [Channels]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *               - provider
 *               - credentials
 *             properties:
 *               name:
 *                 type: string
 *                 description: Display name for the channel
 *                 example: "Mon LinkedIn Pro"
 *               type:
 *                 type: string
 *                 enum: [LINKEDIN, EMAIL, WHATSAPP, TELEGRAM, SLACK, DISCORD, SMS, WEBSITE_CHAT]
 *                 description: Type of channel
 *               provider:
 *                 type: string
 *                 example: "unipile"
 *                 description: Integration provider
 *               credentials:
 *                 type: object
 *                 description: Provider-specific credentials
 *                 properties:
 *                   account_id:
 *                     type: string
 *                     description: Unipile account identifier
 *                   username:
 *                     type: string
 *                     description: LinkedIn username (if applicable)
 *                   password:
 *                     type: string
 *                     description: LinkedIn password (if applicable)
 *                   cookies:
 *                     type: string
 *                     description: LinkedIn cookies (if applicable)
 *               settings:
 *                 type: object
 *                 description: Channel-specific settings
 *     responses:
 *       201:
 *         description: Channel connected successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     type:
 *                       type: string
 *                     provider:
 *                       type: string
 *                     isActive:
 *                       type: boolean
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 */
router.post('/', authenticateToken, channelsController.connectChannel);

/**
 * @swagger
 * /channels:
 *   get:
 *     summary: List all user channels
 *     tags: [Channels]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of channels
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       type:
 *                         type: string
 *                       provider:
 *                         type: string
 *                       isActive:
 *                         type: boolean
 *                       lastSyncAt:
 *                         type: string
 *                         format: date-time
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       _count:
 *                         type: object
 *                         properties:
 *                           conversations:
 *                             type: number
 *                           messages:
 *                             type: number
 */
router.get('/', authenticateToken, channelsController.listChannels);

/**
 * @swagger
 * /channels/{channelId}:
 *   get:
 *     summary: Get channel details
 *     tags: [Channels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: channelId
 *         required: true
 *         schema:
 *           type: string
 *         description: Channel ID
 *     responses:
 *       200:
 *         description: Channel details
 *       404:
 *         description: Channel not found
 */
router.get('/:channelId', authenticateToken, channelsController.getChannel);

/**
 * @swagger
 * /channels/{channelId}/sync:
 *   post:
 *     summary: Synchronize channel data with Unipile
 *     tags: [Channels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: channelId
 *         required: true
 *         schema:
 *           type: string
 *         description: Channel ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               linkedin_product:
 *                 type: string
 *                 enum: [classic, recruiter, sales_navigator]
 *                 description: LinkedIn product to sync
 *               before:
 *                 type: number
 *                 description: End time (epoch timestamp in ms)
 *               after:
 *                 type: number
 *                 description: Start time (epoch timestamp in ms)
 *     responses:
 *       200:
 *         description: Synchronization started
 *       400:
 *         description: Synchronization failed
 */
router.post('/:channelId/sync', authenticateToken, channelsController.syncChannel);

/**
 * @swagger
 * /channels/{channelId}/disconnect:
 *   post:
 *     summary: Disconnect a channel
 *     tags: [Channels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: channelId
 *         required: true
 *         schema:
 *           type: string
 *         description: Channel ID
 *     responses:
 *       200:
 *         description: Channel disconnected successfully
 *       404:
 *         description: Channel not found
 */
router.post('/:channelId/disconnect', authenticateToken, channelsController.disconnectChannel);

/**
 * @swagger
 * /channels/{channelId}/conversations:
 *   get:
 *     summary: Get channel conversations
 *     tags: [Channels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: channelId
 *         required: true
 *         schema:
 *           type: string
 *         description: Channel ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of conversations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: number
 *                     limit:
 *                       type: number
 *                     total:
 *                       type: number
 *                     totalPages:
 *                       type: number
 */
router.get('/:channelId/conversations', authenticateToken, channelsController.getChannelConversations);

export default router; 