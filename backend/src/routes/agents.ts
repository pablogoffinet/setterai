import { Router } from 'express';

const router = Router();

/**
 * @swagger
 * /agents:
 *   get:
 *     summary: Get user AI agents
 *     tags: [Agents]
 *     responses:
 *       200:
 *         description: List of AI agents
 */
router.get('/', (req, res) => {
  res.json({ message: 'Get agents - to be implemented' });
});

/**
 * @swagger
 * /agents:
 *   post:
 *     summary: Create a new AI agent
 *     tags: [Agents]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *               - prompt
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [CUSTOMER_SUPPORT, SALES, MARKETING, CUSTOM]
 *               description:
 *                 type: string
 *               prompt:
 *                 type: string
 *               model:
 *                 type: string
 *                 default: gpt-4
 *               temperature:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 2
 *                 default: 0.7
 *     responses:
 *       201:
 *         description: Agent created successfully
 */
router.post('/', (req, res) => {
  res.json({ message: 'Create agent - to be implemented' });
});

export default router; 