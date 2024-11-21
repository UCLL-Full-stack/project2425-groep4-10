import express, { NextFunction, Request, Response } from 'express';
import coachService from '../service/coach.service';

const coachRouter = express.Router();

/**
 * @swagger
 * /coaches:
 *   get:
 *     summary: Retrieve a list of coaches
 *     responses:
 *       200:
 *         description: A list of coaches
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Coach'
 */
coachRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const coaches = await coachService.getAllCoaches();
        res.status(200).json(coaches);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /coaches/{id}:
 *   get:
 *     summary: Retrieve a coach by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the coach
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A coach object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Coach'
 *       404:
 *         description: Coach not found
 */
coachRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const coach = await coachService.getCoachById({ id });
        if (coach) {
            res.status(200).json(coach);
        } else {
            res.status(404).send('Coach not found');
        }
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Coach:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         user:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *             firstName:
 *               type: string
 *             lastName:
 *               type: string
 *             email:
 *               type: string
 *               format: email
 *             password:
 *               type: string
 *         rating:
 *           type: number
 *           format: float
 *         experience:
 *           type: integer
 */
export default coachRouter;