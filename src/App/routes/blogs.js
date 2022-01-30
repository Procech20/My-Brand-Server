import { Router } from 'express';
import blogControllers from '../controllers/blogs';
import routeValidators from '../middlewares/validator';
import routeProtection from '../middlewares/token';

const { protect, isAdmin } = routeProtection;
const {
        getBlogs, getBlog, createBlog, updateBlog, deleteBlog,
} = blogControllers;

const router = Router();

router.route('/')
/**
 * @swagger
 * /api/blogs:
 *   get:
 *     tags:
 *       - Blogs
 *     name: Get all blogs
 *     summary: Fetch all blogs from database
 *     produces:
 *       - application/json
 *     requestBody:
 *     responses:
 *       '200':
 *             description:  All Blogs retreived successfully
 *       '500':
 *             description: There was an error while fetching blog! Please check the server.
 * */
        .get(getBlogs)
/**
 * @swagger
 * /api/blogs:
 *   post:
 *     tags:
 *       - Blogs
 *     name: Create a Blog
 *     summary: Create a Blog in the database  (Admin & Creator protected route)
 *     consumes:
 *       - multipart/form-data
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: auth
 *         in: header
 *         required: true
 *     requestBody:
 *      content:
 *       multipart/form-data:
 *            schema:
 *              type: object
 *              properties:
 *                title:
 *                  type: string
 *                description:
 *                  type: string
 *                image:
 *                  type: file
 *              required:
 *                  - title
 *                  - description
 *     responses:
 *       '201':
 *             description:  Successfully created blog
 *       '400':
 *             description:  Validation Error.
 *       '401':
 *             description: Access denied! Please check your token.
 *       '403':
 *             description:  Only adminsand Creators are allowed to perfom such action.
 *       '500':
 *             description: There was an error while creating Blog.
 * */
.post(protect, isAdmin, routeValidators.blogValidate, createBlog);

router.route('/:id')
/**
 * @swagger
 * /api/blogs/{id}:
 *   get:
 *     name: Fetch single blog
 *     summary: Fetch blog  from the database
 *     tags:
 *      - Blogs
 *     produces:
 *      - application/json
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: integer
 *     responses:
 *       '200':
 *             description:  Successfully fetched Blog
 *       '400':
 *             description: Validation Error.
 *       '401':
 *             description: Only admins are allowed to perfom such action.
 *       '403':
 *             description: Access denied! Please check your token.
 *       '404':
 *             description:  No Blog found with the provided id
 *       '500':
 *             description: There was an error while fetching Blog.
* */
.get(getBlog)
/**
   * @swagger
   * /api/blogs/{id}:
   *   patch:
   *     name: Update Blog
   *     summary: Update Blog in the database(Admin or Creator protected route)
   *     tags:
   *      - Blogs
   *     consumes:
   *      - multipart/form-data
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
   *     requestBody:
   *      content:
   *       multipart/form-data:
   *            schema:
   *              type: object
   *              properties:
   *                title:
   *                  type: string
   *                description:
   *                  type: string
   *                image:
   *                  type: file
   *     responses:
   *       '201':
   *             description:  Successfully updated Blog
   *       '404':
   *             description:  No Blog found with the provided id
   *       '401':
   *             description: Only admins and creators are allowed to perfom such action.
   *       '403':
   *             description: Access denied! Please check your token.
   *       '500':
   *             description: There was an error while updating user.
   * */
.patch(protect, isAdmin, routeValidators.updateValidate, updateBlog)
/**
     * @swagger
     * /api/blogs/{id}:
     *   delete:
     *     name: Delete Blog
     *     summary: Delete Blog from the database (Admin or Creator protected route)
     *     tags:
     *     - Blogs
     *     consumes:
     *     - application/json
     *     produces:
     *     - application/json
     *     parameters:
     *     - name: auth
     *       in: header
     *       required: true
     *       type: string
     *     - in: path
     *       name: id
     *       required: true
     *       type: integer
     *     responses:
     *       '200':
     *             description:  Successfully deleted user
     *       '404':
     *             description:  No user found with the provided id
     *       '403':
     *             description: Access denied! Please check your token.
     *       '401':
     *             description: Only admins are allowed to perform such action.
     *       '500':
     *             description: There was an error while deleting user.
     * */
        .delete(protect, isAdmin, deleteBlog);

export default router;
