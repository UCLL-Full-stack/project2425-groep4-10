/**
 * @swagger
 *   components:
 *    securitySchemes:
 *     bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 *    schemas:
 *      User:
 *          type: object
 *          properties:
 *            id:
 *              type: number
 *              format: int64
 *            username:
 *              type: string
 *            firstName:
 *              type: string
 *            lastName:
 *              type: string
 *            email:
 *              type: string
 *      Coach:
 *          type: object
 *          properties:
 *            id:
 *              type: number
 *              format: int64
 *            user:
 *              $ref: '#/components/schemas/User'
 *      Player:
 *          type: object
 *          properties:
 *            id:
 *              type: number
 *              format: int64
 *            user:
 *              $ref: '#/components/schemas/User'
 *      Team:
 *          type: object
 *          properties:
 *            id:
 *              type: number
 *              format: int64
 *            teamName:
 *              type: string
 *            location:
 *              type: string
 *            coach:
 *              $ref: '#/components/schemas/Coach'
 *            players:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Player'
 *      Match:
 *          type: object
 *          properties:
 *            id:
 *              type: number
 *              format: int64
 *            teams:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Team'
 *            dateTime:
 *              type: string
 *              format: date-time
 *            location:
 *              type: string
 */

import express, { NextFunction, Request, Response } from 'express';
import matchService from '../service/match.service';

const matchRouter = express.Router();

/**
 * @swagger
 * /matches:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Retrieve a list of matches
 *     responses:
 *       200:
 *         description: A list of matches
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Match'
 */
matchRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const matches = await matchService.getAllMatches();
        res.status(200).json(matches);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /matches/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Retrieve a match by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the match
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A match object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Match'
 *       404:
 *         description: Match not found
 */
matchRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const match = await matchService.getMatchById({ id });
        if (match) {
            res.status(200).json(match);
        } else {
            res.status(404).send('Match not found');
        }
    } catch (error) {
        next(error);
    }
});


export default matchRouter;
