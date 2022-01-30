import uploader from '../config/cloudinary'
import successRes from '../utils/successRes';
import ErrorResponse from '../utils/errorRes';
import blogServices from '../../Database/services/blog';
import blogImage from '../middlewares/photo'
import PostModal from '../../Database/models/blog'

const {
        createBlog,
        deleteBlog,
        findBlog,
        findBlogs,
        updateBlog,
} = blogServices;

class BlogControllers {


        // @desc  Get all blog posts
        // @route GET /api/blogs
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
        // @route GET /api/blogs/:id
        // @access Public,
        static async getBlog(req, res, next) {
                try {
                        const blog = await findBlog({ id: req.params.id });
                        if (!blog) {return next(ErrorResponse(res,404,`Ooops! No such blog was found :(`))};
                        return successRes(res, 200, 'successfully retrieved Blog', blog);
                } catch (err) {
                        return next();
                }
        }

        // // @desc  Create new blog post
        // @route POST /api/blogs
        // @access Private,
        static async createBlog(req, res, next) {
                const photo = await blogImage(req)
                try {
                        const userId = req.user.id;
                        const post = await createBlog({
                                ...req.body,
                                userId,
                                imageId: '',
                                imageUrl: ''
                        });
                        if (req.files) {
                                post.imageUrl = photo.url;
                                post.imageId = photo.public_id;
                                post.save();
                                return successRes(res, 201, 'Successfully created Blog', post);
                        }
                } catch (err) {
                        return next(new ErrorResponse(res,500,`There was an error while creating the Blog: ${err}`));
                }
        }


        // @desc  Update blog post
        // @route PUT /api/blogs/:id
        // @access private,
        static async updateBlog(req, res, next) {
                const photo = await blogImage(req)
                try {
                        const foundBlog = await findBlog({ id: req.params.id });
                        if (!foundBlog) { return next(ErrorResponse(res, 404, `Ooops! No such blog was found :(`)) };

                        const updatedBlog = await updateBlog(
                                { ...req.body },
                                { id: req.params.id },
                        );

                        if (!updatedBlog) { return next(ErrorResponse(res, 404, `Ooops! No such blog was found :(`)) };
                        return successRes(res, 201, 'successfully updated Blog', updatedBlog);
                } catch (err) {
                        return next(new ErrorResponse(res,500,`There was an error while updating Blog! ${err.message}`));
                }

        //         try {
        //                 const updatePost = await PostModal.findByIdAndUpdate(
        //                         req.params.id,
        //                         req.body,
        //                         {
        //                                 new: true,
        //                                 runValidators: true,
        //                         }
        //                 );
        //                 console.log(updatePost);
        //                 const updatedPost = {
        //                         ...req.body = updatePost
        //                 }
        //                 return res.status(200).json({ success: true, data: updatedPost });
        //         } catch (error) {
        //                 return res
        //                         .status(400)
        //                         .json({ success: false, message: `${error.message}` });
        //         }
        }

        // @desc  Delete blog post
        // @route DELETE /api/blogs/:id
        // @access Private
        static async deleteBlog(req, res, next) {
                try {
                        const blog = await deleteBlog({ id: req.params.id });
                        if (!blog) { return next(ErrorResponse(res, 404, `Ooops! No such blog was found:(`)) };
                        return successRes(res, 200, 'Blog deleted successfully', {});
                } catch (err) {
                        return next(err);
                }
        }
}

export default BlogControllers;
