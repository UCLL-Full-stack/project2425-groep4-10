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
 */

import express, { NextFunction, Request, Response } from 'express';
import teamService from '../service/team.service';
import { TeamInput } from '../types';

const teamRouter = express.Router();

/**
 * @swagger
 * /teams:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Retrieve a list of teams
 *     responses:
 *       200:
 *         description: A list of teams
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Team'
 */
teamRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const teams = await teamService.getAllTeams();
        res.status(200).json(teams);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /teams/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Retrieve a team by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the team
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A team object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Team'
 *       404:
 *         description: Team not found
 */
teamRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const team = await teamService.getTeamById({ id });
        if (team) {
            res.status(200).json(team);
        } else {
            res.status(404).send('Team not found');
        }
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /teams:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create a new team
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TeamInput'
 *     responses:
 *       201:
 *         description: Team created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Team'
 */
teamRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const team = <TeamInput>req.body;
        const newTeam = await teamService.createTeam(team);
        res.status(201).json(newTeam);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /teams/{id}/player:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Add a player to a team
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the team
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               playerId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Player added to the team
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Team'
 */
teamRouter.post('/:id/player', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const teamId = parseInt(req.params.id);
        const { playerId } = req.body;
        const newPlayer = await teamService.joinTeam({ teamId, playerId });
        res.status(201).json(newPlayer);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /teams/{id}/player:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Remove a player from a team
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the team
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               playerId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Player removed from the team
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Team'
 */
teamRouter.delete('/:id/player', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const teamId = parseInt(req.params.id);
        const { playerId } = req.body;
        const player = await teamService.leaveTeam({ teamId, playerId });
        res.status(200).json(player);
    } catch (error) {
        next(error);
    }
});


export default teamRouter;
