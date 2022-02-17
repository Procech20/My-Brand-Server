// import uploader from '../config/cloudinary';
import successRes from '../utils/successRes';
import ErrorResponse from '../utils/errorRes';
import blogServices from '../services/blog';
import blogImage from '../middlewares/photo';
import Comment from '../models/comment';
const { createBlog, deleteBlog, findBlog, findBlogs, updateBlog } =
	blogServices;

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
			if (!blog) {
				return next(
					ErrorResponse(res, 404, `Ooops! No such blog was found :(`),
				);
			}
			return successRes(res, 200, 'successfully retrieved Blog', blog);
		} catch (err) {
			return next();
		}
	}

	// // @desc  Create new blog post
	// @route POST /api/blogs
	// @access Private,
	static async createBlog(req, res, next) {
		try {
			const userId = req.user.id;
			const post = await createBlog({
				...req.body,
				userId,
				imageId: '',
				imageUrl: '',
			});
			if (req.files) {
				const photo = await blogImage(req);
				post.imageUrl = photo.url;
				post.imageId = photo.public_id;
				post.save();
			}
			return successRes(res, 201, 'Successfully created Blog', post);
		} catch (err) {
			return next(
				new ErrorResponse(
					res,
					500,
					`There was an error while creating the Blog: ${err}`,
				),
			);
		}
	}

	// @desc  Update blog post
	// @route PUT /api/blogs/:id
	// @access private,
	static async updateBlog(req, res, next) {
		try {
			const foundBlog = await findBlog({ id: req.params.id });
			if (!foundBlog) {
				return next(
					ErrorResponse(res, 404, `Ooops! No such blog was found :(`),
				);
			}

			const updatedBlog = await updateBlog(
				{ id: req.params.id },
				{ ...req.body },
			);

			if (!updatedBlog) {
				return next(
					ErrorResponse(res, 404, `Ooops! No such blog was found :(`),
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
	// @route DELETE /api/blogs/:id
	// @access Private
	static async deleteBlog(req, res, next) {
		try {
			const blog = await deleteBlog({ id: req.params.id });
			if (!blog) {
				return next(
					ErrorResponse(res, 404, `Ooops! No such blog was found :(`),
				);
			}
			// await uploader.destroy(blog.cloudinary_id);
			return successRes(res, 204, 'Blog deleted successfully');
		} catch (err) {
			return next(
				new ErrorResponse(
					res,
					500,
					`There was an error while deleting blog... ${err.message}`,
				),
			);
		}
	}
	static async comment(req, res, next) {
		try {
			const blog = await findBlog({ id: req.params.id });
			const { message } = req.body;
			const comment = await Comment.create({
				message,
			});

			blog.comments.push(comment.id);
			blog.commentCounts += 1;
			await blog.save();

			return successRes(res, 201, `comment successfully created, ${comment}`);
		} catch (err) {
			return next(
				new ErrorResponse(
					res,
					500,
					`There was an error while creating comment... ${err.message}`,
				),
			);
		}
	}
}

export default BlogControllers;
