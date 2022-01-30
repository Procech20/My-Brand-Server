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
        .get(getBlogs)
        .post(protect, isAdmin, routeValidators.blogValidate, createBlog);

router.route('/:id')
        .get(getBlog)
        .patch(protect, isAdmin, routeValidators.updateValidate, updateBlog)
        .delete(protect, isAdmin, deleteBlog);

export default router;
