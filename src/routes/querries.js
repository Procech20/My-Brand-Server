import { Router } from 'express';
import routeProtection from '../middlewares/token';
import querryServices from '../controllers/querry';

const { getQuerries, createQuerry, deleteQuerry, getQuerry, updateQuerry } =
	querryServices;

const router = Router();

router
	.route('/')
	/**
	 * @swagger
	 * /api/querries:
	 *   get:
	 *     tags:
	 *       - Querries
	 *     name: Get all querries
	 *     summary: Fetch all querries from database (Admin protected route)
	 *     produces:
	 *       - application/json
	 *     parameters:
	 *      - name: auth
	 *        in: header
	 *        required: true
	 *     responses:
	 *       '200':
	 *             description:  All querries retreived successfully
	 *       '500':
	 *             description: There was an error while fetching querries! Please check the server.
	 * */
	.get(routeProtection.protect, routeProtection.isAdmin, getQuerries)
	/**
	 * @swagger
	 * /api/querries:
	 *   post:
	 *     tags:
	 *       - Querries
	 *     name: Create a querry
	 *     summary: Create a querry  (Admin protected route)
	 *     consumes:
	 *       -application/json
	 *     produces:
	 *       - application/json
	 *     parameters:
	 *      - name: auth
	 *        in: header
	 *        required: true
	 *     requestBody:
	 *      content:
	 *          application/json:
	 *            schema:
	 *              type: object
	 *              properties:
	 *                names:
	 *                  type: string
	 *                email:
	 *                  type: string
	 *                project:
	 *                  type: string
	 *                message:
	 *                  type: string
	 *              required:
	 *                  - email
	 *                  - project
	 *                  - names
	 *     responses:
	 *       '201':
	 *             description:  Successfully created querry
	 *       '400':
	 *             description:  Validation Error.
	 *       '401':
	 *             description:  Ooops! you're not allowed to access this page.
	 *       '403':
	 *             description:  Access denied! Please login first.
	 *       '500':
	 *             description: Unable to create querry.
	 * */
	.post(routeProtection.protect, routeProtection.isAdmin, createQuerry);
router
	.route('/:id')
	/**
	 * @swagger
	 * /api/querries/{id}:
	 *   get:
	 *     name: Fetch single querry
	 *     summary: Fetch a querry from the database (Admin protected route)
	 *     tags:
	 *       - Querries
	 *     produces:
	 *       - application/json
	 *     parameters:
	 *       - name: auth
	 *         in: header
	 *         required: true
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         type: integer
	 *     responses:
	 *       '200':
	 *             description:  Successfully fetched querry
	 *       '401':
	 *             description: Ooops! you are not allowed to access this page.
	 *       '403':
	 *             description: Access denied! Please sign in first.
	 *       '404':
	 *             description:  No querry found with the provided id
	 *       '500':
	 *             description: Unable to get querry.
	 * */
	.get(routeProtection.protect, routeProtection.isAdmin, getQuerry)
	/**
	 * @swagger
	 * /api/querries/{id}:
	 *   patch:
	 *     name: Update querry
	 *     summary: Update a querry in the database (Admin protected route)
	 *     tags:
	 *       - Querries
	 *     consumes:
	 *       - application/json
	 *     produces:
	 *       - application/json
	 *     parameters:
	 *       - name: auth
	 *         in: header
	 *         required: true
	 *         type: string
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         type: integer
	 *     requestBody:
	 *      content:
	 *          application/json:
	 *            schema:
	 *              type: object
	 *              properties:
	 *                email:
	 *                  type: string
	 *                names:
	 *                  type: string
	 *                project:
	 *                  type: string
	 *                message:
	 *                  type: string
	 *     responses:
	 *       '201':
	 *             description:  Successfully updated querry
	 *       '400':
	 *             description:  Validation error.
	 *       '401':
	 *             description: Ooops! you are not allowed to access this page.
	 *       '403':
	 *             description: Access denied! Please sign in first.
	 *       '404':
	 *             description:  No querry found with the provided id
	 *       '500':
	 *             description: Unable to get querry.
	 * */
	.patch(routeProtection.protect, routeProtection.isAdmin, updateQuerry)
	/**
	 * @swagger
	 * /api/querries/{id}:
	 *   delete:
	 *     name: Delete querry
	 *     summary: Delete querry from the database (Admin protected route)
	 *     tags:
	 *      - Querries
	 *     produces:
	 *      - application/json
	 *     parameters:
	 *      - name: auth
	 *        in: header
	 *        required: true
	 *        type: string
	 *      - in: path
	 *        name: id
	 *        required: true
	 *        type: integer
	 *     responses:
	 *       '200':
	 *             description:  Successfully deleted querry
	 *       '401':
	 *             description: Ooops! you are not allowed to access this page.
	 *       '403':
	 *             description: Access denied! Please sign in first.
	 *       '404':
	 *             description:  No querry found with the provided id
	 *       '500':
	 *             description: Unable to delete querry.
	 * */
	.delete(routeProtection.protect, routeProtection.isAdmin, deleteQuerry);

export default router;
