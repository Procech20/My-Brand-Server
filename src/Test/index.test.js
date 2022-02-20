import mocha from 'mocha';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import path from 'path';
import app from '../index';
import { mockBlog, mockblog3 } from './mocks/blogs.mock';
import { wrongEmail, emptyEmail, mockUser4 } from './mocks/users.mock';

const { it, describe } = mocha;

const tester = {
	email: 'jack@techblogs.pro',
	password: 'Tester@123',
	firstName: 'Jack',
	surName: 'Doe',
	role: 'Admin',
};

chai.expect();
chai.use(chaiHttp);

describe('Testing Welcome and test Error Route', () => {
	it('should Welcome a user to the api and test unavailable routes', async () => {
		const res = await chai.request(app).get('/');
		expect(res.status).to.be.equal(200);
		expect(res.body).to.be.a('object');
		expect(res.body).to.have.property(
			'message',
			'Hello! Welcome to My blog :)',
		);
		const res1 = await chai.request(app).get('/api/*');
		expect(res1.status).to.be.equal(404);
		expect(res1.body).to.be.a('object');
		expect(res1.body).to.have.property(
			'message',
			'route not found :(  .... Please try a valid route like : /api/blogs or /api/users',
		);
	});
});

describe('Test all validation errors', () => {
	it('should check valid email for login.', async () => {
		const signup = await chai
			.request(app)
			.post('/api/auth/register')
			.send(tester);
		const res = await chai
			.request(app)
			.post('/api/auth/login')
			.send({ email: 'hailu@gmail.com', password: signup.body.data.password });
		expect(res.status).to.be.equal(404);
		expect(res.body).to.have.property('success', false);
		expect(res.body).to.have.property('message', 'User Not found');
	});
	it('should validate login.', async () => {
		const signup = await chai
			.request(app)
			.post('/api/auth/register')
			.send(tester);
		const { password } = signup;
		const res = await chai
			.request(app)
			.post('/api/auth/login')
			.send({ password });
		expect(res.status).to.be.equal(400);
		expect(res.body).to.be.a('object');
		expect(res.body).to.have.property(
			'message',
			'Validation error: Email is required',
		);
	});
	it('should validate signup.', async () => {
		const res = await chai
			.request(app)
			.post('/api/auth/register')
			.send(mockUser4);
		expect(res.status).to.be.equal(400);
		expect(res.body).to.have.property('success', false);
	});
	it('should validate blog creation and update.', async () => {
		const signup = await chai
			.request(app)
			.post('/api/auth/register')
			.send(tester);
		const signin = await chai
			.request(app)
			.post('/api/auth/login')
			.send({ email: tester.email, password: tester.password });
		const token = `Bearer ${signin.body.data.token}`;
		const re = await chai
			.request(app)
			.post('/api/blogs')
			.set('auth', token)
			.field('title', mockBlog.title)
			.field('description', 'Hmnjb bhknub vyukyu vuykbyvh')
			.attach('image', path.resolve(__dirname, './mocks/pro.jpg'));
		const res = await chai
			.request(app)
			.post('/api/blogs')
			.set('auth', token)
			.field('title', 'nggg')
			.field('description', 'Hmnjb bhknub vyukyu vuykbyvh')
			.attach('image', path.resolve(__dirname, './mocks/pro.jpg'));
		expect(res.status).to.be.equal(400);
		expect(res.body).to.be.a('object');
		expect(res.body).to.have.property('success', false);
		expect(res.body).to.have.property(
			'message',
			'Validation error: Please Add a title to your blog of atleast 10 characters!',
		);
		const res1 = await chai
			.request(app)
			.post('/api/blogs')
			.set('auth', token)
			.send(mockblog3);
		const res2 = await chai
			.request(app)
			.post(`/api/blogs/${res1.body.data.id}`)
			.set('auth', token)
			.send(mockblog3);
		expect(res2.status).to.be.equal(400);
		expect(res2.body).to.be.a('object');
		expect(res2.body).to.have.property(
			'message',
			'Validation error: Title must be atleast 10 characters!',
		);
	});
});
