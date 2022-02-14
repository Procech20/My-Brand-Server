import { Router } from 'express';
import noRoute from '../controllers/error';

const router = Router();

router.route('/*')
        /**
 * @swagger
 * /api/*:
 *   get:
 *     tags:
 *       - Error
 *     name: Uknown route
 *     summary: A route for unknown endpoints
 *     produces:
 *       - application/json
 *     requestBody:
 *     responses:
 *       '404':
 *             description:  route not found! Please try a valid route like /api/blogs or /api/users
 * */
        .get(noRoute.error);

export default router;
