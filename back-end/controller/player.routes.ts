import express, { NextFunction, Request, Response } from 'express';
import playerService from '../service/player.service';

const playerRouter = express.Router();

/**
 * @swagger
 * /players:
 *   get:
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

/**
 * @swagger
 * components:
 *   schemas:
 *     Player:
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
 *         position:
 *           type: string
 *         age:
 *           type: integer
 */
export default playerRouter;
