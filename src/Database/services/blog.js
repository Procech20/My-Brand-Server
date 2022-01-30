// import Models from '../models/server';

const { Blog } = Models;

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
    const blogs = await Blog.findAll();
    return blogs;
  }

  static async updateBlog(blog, param) {
    const updatedBlog = await Blog.update(blog, {
      where: param,
    });
    return updatedBlog;
  }

  static async deleteBlog(param) {
    const blog = await Blog.destroy({
      where: param,
    });
    return blog;
  }
}

export default blogServices;
