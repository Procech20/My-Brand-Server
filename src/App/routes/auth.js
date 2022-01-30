import { Router } from 'express';
import routeValidators from '../middlewares/validator';
import auth from '../controllers/auth';
import routeProtection from '../middlewares/token';

const { loginValidate, signupValidate } = routeValidators;

const router = Router();

router.route('/register')
/**
* @swagger
* /api/auth/register:
*   post:
*     tags:
*       - auth
*     name: User Registration
*     summary: Registering a user
*     consumes:
*       -application/json
*     produces:
*       - application/json
*     requestBody:
*      content:
*          application/json:
*            schema:
*              type: object
*              properties:
*                firstName:
*                  type: string
*                surName:
*                  type: string
*                email:
*                  required: true
*                password:
*                  type: string
*              required:
*                  - email
*                  - password
*                  - firstName
*                  - surName
*
 *     responses:
 *       '201':
 *             description:  Successfully Registered a user
 *       '400':
 *             description:  User already exists
 *       '500':
 *             description: There was an error while creating User! Please check the server.
 * */
.post(signupValidate, auth.register);

router.route('/login')
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - auth
 *     name: User login
 *     summary: Route for user login
 *     consumes:
 *       -application/json
 *     produces:
 *       - application/json
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
 *     responses:
 *       '200':
 *             description:  User login successful
 *       '400':
 *             description:  Validation error Email is required
 *       '401':
 *             description:  Invalid password
 *       '404':
 *             description:  User Not found
 *       '500':
 *             description: There was an error while creating User! Please check the server.
 * */
        .post(loginValidate, auth.login);

router.route('/me')
/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     tags:
 *       - auth
 *     name: Get logged User
 *     summary: Fetch a logged in user from database from the provided token.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: auth
 *         in: header
 *         required: true
 *     requestBody:
 *     responses:
 *       '200':
 *             description:  User is logged in!
 *       '400':
 *             description: No token provided or incomplete token
 *       '500':
 *             description:  Error while checking token! Cannot read property 'split' of undefined
 * */
        .get(routeProtection.protect, auth.logged);

export default router;
