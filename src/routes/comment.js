import { Router } from 'express';
import blogControllers from '../controllers/blogs';
import routeProtection from '../middlewares/token';
import routeValidators from '../middlewares/validator';

const { comment } = blogControllers;
const { commentValidate } = routeValidators;

const router = Router();

router
	.route('/:id')
	/**
	 * @swagger
	 * /api/blogs/comments/{id}:
	 *   post:
	 *     tags:
	 *       - Comments
	 *     name: comment
	 *     summary: add a comment to a blog
	 *     consumes:
	 *       - application/json
	 *     parameters:
	 *       - name: id
	 *         in: path
	 *         required: true
	 *     requestBody:
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             properties:
	 *                message:
	 *                 type: string
	 *     responses:
	 *       201:
	 *             description: Comment successfully added.
	 *       400:
	 *             description: Bad request.
	 *       500:
	 *             description: server error.
	 * */

	.post(commentValidate, comment);

export default router;
