import { Router } from 'express';
import blogControllers from '../controllers/blogs';
import routeProtection from '../middlewares/token';
import routeValidators from '../middlewares/validator';

const { comment } = blogControllers;
const { protect } = routeProtection;
const { commentValidate } = routeValidators;

const router = Router();

router
	.route('/:id')
	/**
	 * @swagger
	 * /api/blog/comment/{id}:
	 *   post:
	 *     tags:
	 *       - Blogs
	 *     name: comment
	 *     summary: add a comment to a blog
	 *     consumes:
	 *       - application/json
	 *     parameters:
	 *       - name: auth
	 *         in: header
	 *         required: true
	 *       - name: id
	 *         in: path
	 *         required: true
	 *     requestBody:
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             properties:
	 *                name:
	 *                 type: string
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

	.post(protect, commentValidate, comment);

export default router;
