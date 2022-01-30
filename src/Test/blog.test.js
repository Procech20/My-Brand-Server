import mocha from 'mocha';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import path from 'path';
import Sinon from 'sinon';
import Blog from '../Database/models/blog';
import app from '../index';
import { mockBlog } from './mocks/blogs.mock';
import { mockAdmin } from './mocks/users.mock';
import cloudinary from '../App/config/cloudinary';


// const signin = async (user) => {
//   const userData = await chai.request(app).post('/api/auth/login').send(user);
//   const data = {
//     id: `${userData.body.data.foundUser.id}`,
//     token: `Bearer ${userData.body.data.token}`,
//   };
//   return data;
// };

const {
  it, describe, beforeEach, afterEach,
} = mocha;

chai.expect();
chai.use(chaiHttp);

const tester = {
  email: 'tester@techblogs.pro',
  password: 'Tester@123',
  firstName: 'James',
  surName: 'Doe',
  role: 'Admin'
};

const testerLogin = {
  email: 'tester@techblogs.pro',
  password: 'Tester@123',
}

describe('Testing Blog routes', () => {
  const sandbox = Sinon.createSandbox();
  beforeEach(async () => {
    sandbox.stub(cloudinary, 'upload').resolves({
      url: 'wazaaaaa',
    });
    await Blog.deleteMany({
      where: { },
      truncate: true,
    });
  });
  afterEach(async () => {
    await Blog.deleteMany({
      where: { },
      truncate: true,
    });
    sandbox.restore();
  });
  it('should Create, Update, Delete and Fetch all or single Blog.', async () => {
    const signup = await chai.request(app).post('/api/auth/register').send(tester);
    // console.log(signup.email);
    const signin = await chai.request(app).post('/api/auth/login').send(testerLogin);


    const res = await chai.request(app).get('/api/blogs');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.a('object');
    expect(res.body).to.have.property('message', 'All Blogs retreived successfully');
    // const Dummy = await signin(mockAdmin);
    const token  = `Bearer ${signin.body.data.token}`;
    const res1 = await chai.request(app).post('/api/blogs').field('title', mockBlog.title).field('description', mockBlog.description)
      .attach('image', path.resolve(__dirname, './mocks/pro.jpg'))
      .set('auth', token);
    // console.log(res1);

    expect(res1.status).to.be.equal(201);
    expect(res1.body).to.be.a('object');
    expect(res1.body).to.have.property('success', true);
    expect(res1.body).to.have.property('data');
    expect(res1.body).to.have.property('message', 'Successfully created Blog');
    const res2 = await chai.request(app).get(`/api/blogs/${res1.body.data.id}`);
    expect(res2.status).to.be.equal(200);
    expect(res2.body).to.be.a('object');
    expect(res2.body).to.have.property('message', 'successfully retrieved Blog');
    const res3 = await chai.request(app)
      .patch(`/api/blogs/${res1.body.data.id}`).attach('image', path.resolve(__dirname, './mocks/crop.php.jpg'))
      .set('auth', token);
    expect(res3.status).to.be.equal(201);
    expect(res3.body).to.be.a('object');
    expect(res3.body).to.have.property('success');
    expect(res3.body).to.have.property('data');
    expect(res3.body).to.have.property('message', 'successfully updated Blog');
    const res4 = await chai.request(app)
      .delete(`/api/blogs/${res1.body.data.id}`).set('auth', token);
    expect(res4.status).to.be.equal(200);
    expect(res4.body).to.be.a('object');
    expect(res4.body).to.have.property('message', 'Blog deleted successfully');
  });
});
