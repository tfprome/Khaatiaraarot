import { Router } from 'express';
import {
  listRatePlans,
  getRatePlan,
  createRatePlan,
  updateRatePlan,
  deleteRatePlan,
} from '../../controllers/admin/ratePlan.controller';

const router = Router();

/**
 * @swagger
 * /admin/rate-plans:
 *   get:
 *     tags: [Admin - Rate Plans]
 *     summary: List all delivery rate plans with district rates
 *     responses:
 *       200:
 *         description: List of rate plans
 *   post:
 *     tags: [Admin - Rate Plans]
 *     summary: Create a new rate plan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, rates]
 *             properties:
 *               name: { type: string, minLength: 2 }
 *               description: { type: string }
 *               isActive: { type: boolean, default: true }
 *               rates:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required: [district, costPerUnit]
 *                   properties:
 *                     district: { type: string }
 *                     costPerUnit: { type: number, minimum: 0 }
 *     responses:
 *       201:
 *         description: Rate plan created
 */
router.get('/', listRatePlans);
router.post('/', createRatePlan);

/**
 * @swagger
 * /admin/rate-plans/{id}:
 *   get:
 *     tags: [Admin - Rate Plans]
 *     summary: Get single rate plan with all district rates
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Rate plan detail
 *       404:
 *         description: Not found
 *   put:
 *     tags: [Admin - Rate Plans]
 *     summary: Update rate plan. Providing rates replaces ALL existing district rates.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               isActive: { type: boolean }
 *               rates:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     district: { type: string }
 *                     costPerUnit: { type: number }
 *     responses:
 *       200:
 *         description: Rate plan updated
 *   delete:
 *     tags: [Admin - Rate Plans]
 *     summary: Delete rate plan (cascades district rates, sets ratePlanId null on products)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Deleted
 */
router.get('/:id', getRatePlan);
router.put('/:id', updateRatePlan);
router.delete('/:id', deleteRatePlan);

export default router;
