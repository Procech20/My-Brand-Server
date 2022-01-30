import photos from '../middlewares/photo';
import successRes from '../utils/successRes';
import ErrorResponse from '../utils/errorRes';
import blogServices from '../../Database/services/blog';

const {
        createBlog,
        deleteBlog,
        findBlog,
        findBlogs,
        updateBlog,
} = blogServices;

class BlogControllers {
        // @desc  Get all blog posts
        // @route GET /api/v1/techblogs
        // @access Public
        static async getBlogs(req, res, next) {
                try {
                        const blog = await findBlogs();
                        return successRes(res, 200, 'All Blogs retreived successfully', blog);
                } catch (err) {
                        return next();
                }
        }


        // @desc  Get single blog post
        // @route GET /api/v1/techblogs/:id
        // @access Public,
        static async getBlog(req, res, next) {
                try {
                        const blog = await findBlog({ id: req.params.id });
                        if (!blog) {
                                return next(
                                        ErrorResponse(
                                                res,
                                                404,
                                                `Ooops! No such blog was found :(`,
                                        ),
                                );
                        }
                        return successRes(res, 200, 'successfully retrieved Blog', blog);
                } catch (err) {
                        return next();
                }
        }

        // // @desc  Create new blog post
        // @route POST /api/v1/techblogs
        // @access Private,
        static async createBlog(req, res, next) {
                const image = await photos(req);
                try {
                        const userId = req.user.id;
                        const post = await createBlog({
                                ...req.body,
                                userId,
                                imageUrl: '',
                                time: Date.now(),
                        });
                        if (req.files) {
                                post.imageUrl = image;
                                post.save();
                        }
                        return successRes(res, 201, 'Successfully created Blog', post);
                } catch (err) {
                        return next(
                                new ErrorResponse(
                                        res,
                                        500,
                                        `There was an error while updating Blog! ${err.message}`,
                                ),
                        );
                }
        }


        // @desc  Update blog post
        // @route PUT /api/v1/techblogs/:id
        // @access private,
        static async updateBlog(req, res, next) {
                const image = await photos(req);
                try {
                        const foundBlog = await findBlog({ id: req.params.id });
                        if (!foundBlog) {
                                return next(
                                        ErrorResponse(
                                                res,
                                                404,
                                                `Ooops! No such blog was found :(`,
                                        ),
                                );
                        }
                        const photo = image;
                        const updatedBlog = await updateBlog(
                                { ...req.body, imageUrl: photo },
                                { id: req.params.id },
                        );

                        if (!updatedBlog) {
                                return next(
                                        ErrorResponse(
                                                res,
                                                404,
                                                `Ooops! No such blog was found :(`,
                                        ),
                                );
                        }
                        return successRes(res, 201, 'successfully updated Blog', updatedBlog);
                } catch (err) {
                        return next(
                                new ErrorResponse(
                                        res,
                                        500,
                                        `There was an error while updating Blog! ${err.message}`,
                                ),
                        );
                }
        }

        // @desc  Delete blog post
        // @route DELETE /api/v1/techblogs/:id
        // @access Private
        static async deleteBlog(req, res, next) {
                try {
                        const blog = await deleteBlog({ id: req.params.id });
                        if (!blog) {
                                return next(
                                        ErrorResponse(
                                                res,
                                                404,
                                                `Ooops! No such blog was found:(`,
                                        ),
                                );
                        }
                        return successRes(res, 200, 'Blog deleted successfully', {});
                } catch (err) {
                        return next(err);
                }
        }
}

export default BlogControllers;
