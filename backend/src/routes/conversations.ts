import { Router } from 'express';

const router = Router();

/**
 * @swagger
 * /conversations:
 *   get:
 *     summary: Get user conversations
 *     tags: [Conversations]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, CLOSED, ARCHIVED, SPAM]
 *     responses:
 *       200:
 *         description: List of conversations
 *       401:
 *         description: Unauthorized
 */
router.get('/', (req, res) => {
  res.json({ message: 'Get conversations - to be implemented' });
});

/**
 * @swagger
 * /conversations/{id}:
 *   get:
 *     summary: Get conversation by ID
 *     tags: [Conversations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Conversation details
 *       404:
 *         description: Conversation not found
 */
router.get('/:id', (req, res) => {
  res.json({ message: `Get conversation ${req.params.id} - to be implemented` });
});

/**
 * @swagger
 * /conversations/{id}/messages:
 *   get:
 *     summary: Get messages for a conversation
 *     tags: [Conversations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *     responses:
 *       200:
 *         description: List of messages
 */
router.get('/:id/messages', (req, res) => {
  res.json({ message: `Get messages for conversation ${req.params.id} - to be implemented` });
});

export default router; 