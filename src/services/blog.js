import Blog from '../models/blog';

class blogServices {
	static async findBlog({ id: _id }) {
		const blog = await Blog.findOne({ _id });
		return blog;
	}

	static async createBlog(blog) {
		const createdBlog = await Blog.create(blog);
		return createdBlog;
	}

	static async findBlogs() {
		const blogs = await Blog.find().sort({ time: -1 });
		return { blogCount: blogs.length, blogs };
	}

	// static async updateBlog(blog, param) {
	//   const updatedBlog = await Blog.updateOne(blog, {where: param,});
	//   return updatedBlog;
	// }
	static async updateBlog({ id: _id }, post) {
		const updatedBlog = await Blog.findOneAndUpdate({ _id }, post, {
			new: true,
			runValidators: true,
		});
		return updatedBlog;
	}

	static async deleteBlog({ id: _id }) {
		const blog = await Blog.findOneAndDelete({ _id });
		return blog;
	}
}

export default blogServices;
