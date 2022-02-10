import { Router } from 'express';
import routeValidators from '../middlewares/validator';
import routeProtection from '../middlewares/token';
import userServices from '../controllers/user';

const { getUsers, createUser, deleteUser, getUser, updateUser } = userServices;

const router = Router();

router
	.route('/')
	/**
	 * @swagger
	 * /api/users:
	 *   get:
	 *     tags:
	 *       - Users
	 *     name: Get all users
	 *     summary: Fetch all users from database (Admin protected route)
	 *     produces:
	 *       - application/json
	 *     parameters:
	 *      - name: auth
	 *        in: header
	 *        required: true
	 *     responses:
	 *       '200':
	 *             description:  All users retreived successfully
	 *       '500':
	 *             description: There was an error while fetching users! Please check the server.
	 * */
	.get(routeProtection.protect, routeProtection.isAdmin, getUsers)
	/**
	 * @swagger
	 * /api/users:
	 *   post:
	 *     tags:
	 *       - Users
	 *     name: Create a user
	 *     summary: Create a user  (Admin protected route)
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
	 *                email:
	 *                  type: string
	 *                password:
	 *                  type: string
	 *                surName:
	 *                  required: true
	 *                lastName:
	 *                  type: string
	 *              required:
	 *                  - email
	 *                  - password
	 *                  - firstName
	 *                  - surName
	 *     responses:
	 *       '201':
	 *             description:  Successfully created user
	 *       '400':
	 *             description:  Validation Error.
	 *       '401':
	 *             description:  Only admins are allowed to perfom such action.
	 *       '403':
	 *             description:  Access denied! Please check your token.
	 *       '500':
	 *             description: There was an error while creating User! Please check the server.
	 * */
	.post(
		routeProtection.protect,
		routeProtection.isAdmin,
		routeValidators.signupValidate,
		createUser,
	);
router
	.route('/:id')
	/**
	 * @swagger
	 * /api/users/{id}:
	 *   get:
	 *     name: Fetch single user
	 *     summary: Fetch a user  from the database
	 *     tags:
	 *       - Users
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
	 *             description:  User signed in
	 *       '401':
	 *             description: Only admins are allowed to perfom such action.
	 *       '403':
	 *             description: Access denied! Please check your token.
	 *       '404':
	 *             description:  No user found with the provided id
	 *       '500':
	 *             description: There was an error while fetching user! Please check the server.
	 * */
	.get(routeProtection.protect, routeProtection.isAdmin, getUser)
	/**
	 * @swagger
	 * /api/users/{id}:
	 *   patch:
	 *     name: Update user
	 *     summary: Update a user in the database(Admin protected route)
	 *     tags:
	 *       - Users
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
	 *                password:
	 *                  type: string
	 *                surName:
	 *                  type: string
	 *                lastName:
	 *                  type: string
	 *     responses:
	 *       '201':
	 *             description:  Successfully updated user
	 *       '400':
	 *             description:  Validation error.
	 *       '401':
	 *             description: Only admins are allowed to perfom such action.
	 *       '403':
	 *             description: Access denied! Please check your token.
	 *       '404':
	 *             description:  No user found with the provided id
	 *       '500':
	 *             description: There was an error while updating user Please check the server.
	 * */
	.patch(routeProtection.protect, routeProtection.isAdmin, updateUser)
	/**
	 * @swagger
	 * /api/users/{id}:
	 *   delete:
	 *     name: Delete user
	 *     summary: Delete user from the database (Admin protected route)
	 *     tags:
	 *      - Users
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
	 *             description:  Successfully deleted user
	 *       '401':
	 *             description: Only admins are allowed to perform such action.
	 *       '403':
	 *             description: Access denied! Please check your token.
	 *       '404':
	 *             description:  No user found with the provided id
	 *       '500':
	 *             description: There was an error while deleting user! Please check the server.
	 * */
	.delete(routeProtection.protect, routeProtection.isAdmin, deleteUser);

export default router;
