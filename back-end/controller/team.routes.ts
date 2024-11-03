import express, { NextFunction, Request, Response } from 'express';
import teamService from '../service/team.service';

const teamRouter = express.Router();

/**
 * @swagger
 * /teams:
 *   get:
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
        const team = req.body;
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

/**
 * @swagger
 * components:
 *   schemas:
 *     Team:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         teamName:
 *           type: string
 *         location:
 *           type: string
 *         coach:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             user:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 email:
 *                   type: string
 *                   format: email
 *                 password:
 *                   type: string
 *         players:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               user:
 *                 type: object
 *                 properties:
 *                   username:
 *                     type: string
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *                   email:
 *                     type: string
 *                     format: email
 *                   password:
 *                     type: string
 *     TeamInput:
 *       type: object
 *       properties:
 *         teamName:
 *           type: string
 *         location:
 *           type: string
 *         coach:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *         players:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               user:
 *                 type: object
 *                 properties:
 *                   username:
 *                     type: string
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *                   email:
 *                     type: string
 *                     format: email
 *                   password:
 *                     type: string
 */
export default teamRouter;
