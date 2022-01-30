import Blog from '../models/blog';


class blogServices {
  static async findBlog(param) {
    const blog = await Blog.findOne({ where: param });
    return blog;
  }

  static async createBlog(blog) {
    const createdBlog = await Blog.create(blog);
    return createdBlog;
  }

  static async findBlogs() {
    const blogs = await Blog.find().sort({ time: -1 });
    return {blogCount: blogs.length, blogs};
  }

  // static async updateBlog(blog, param) {
  //   const updatedBlog = await Blog.updateOne(blog, {where: param,});
  //   return updatedBlog;
  // }
  static async updateBlog(blog, param) {
    const updatedBlog = await Blog.updateOne(blog, {
      where: param,
    });
    return updatedBlog;
  }

  static async deleteBlog(param) {
    const blog = await Blog.deleteOne({
      where: param,
    });
    return blog;
  }
}

export default blogServices;
