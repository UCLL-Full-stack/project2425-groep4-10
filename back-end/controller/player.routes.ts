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
 *      Player:
 *          type: object
 *          properties:
 *            id:
 *              type: number
 *              format: int64
 *            user:
 *              $ref: '#/components/schemas/User'
 *            age:
 *              type: number
 *            position:
 *              type: string
 */

import express, { NextFunction, Request, Response } from 'express';
import playerService from '../service/player.service';

const playerRouter = express.Router();

/**
 * @swagger
 * /players:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Retrieve a list of players
 *     responses:
 *       200:
 *         description: A list of players
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Player'
 */
playerRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const players = await playerService.getAllPlayers();
        res.status(200).json(players);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /players/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Retrieve a player by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the player
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A player object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Player'
 *       404:
 *         description: Player not found
 */
playerRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const player = await playerService.getPlayerById({ id });
        if (player) {
            res.status(200).json(player);
        } else {
            res.status(404).send('Player not found');
        }
    } catch (error) {
        next(error);
    }
});

export default playerRouter;
