import express, { NextFunction, Request, Response } from 'express';
import parentService from '../service/parent.service';

const parentRouter = express.Router();

/**
 * @swagger
 * /parents:
 *   get:
 *     summary: Retrieve a list of parents
 *     responses:
 *       200:
 *         description: A list of parents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Parent'
 */
parentRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parents = await parentService.getAllParents();
        res.status(200).json(parents);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /parents/{id}:
 *   get:
 *     summary: Retrieve a parent by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the parent
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A parent object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Parent'
 *       404:
 *         description: Parent not found
 */
parentRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const parent = await parentService.getParentById({ id });
        if (parent) {
            res.status(200).json(parent);
        } else {
            res.status(404).send('Parent not found');
        }
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Parent:
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
 *         sex:
 *           type: string
 */
export default parentRouter;
