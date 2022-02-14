import mocha from 'mocha';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import path from 'path';
import app from '../index';
import { mockBlog, mockblog2, mockblog3 } from './mocks/blogs.mock';
import { emptyEmail } from './mocks/users.mock';

const { it, describe } = mocha;

const tester = {
	email: 'jack.doe@techblogs.pro',
	password: 'Tester@123',
	firstName: 'Jack',
	surName: 'Doe',
	role: 'Admin',
};
const tester2 = {
	email: 'jacky.doe@techblogs.pro',
	password: 'Tester@123',
	firstName: 'Jacky',
	surName: 'Doe',
	role: 'Admin',
};
const tester3 = {
	email: 'jacky@techblogs.pro',
	password: 'Tester@123',
	firstName: 'Jacky',
	surName: 'Doe',
	role: 'Admin',
};

chai.expect();
chai.use(chaiHttp);

describe('Testing Welcome and test Error Route', () => {
	it('should Welcome a user to the api', async () => {
		const res = await chai.request(app).get('/');
		expect(res.status).to.be.equal(200);
		expect(res.body).to.be.a('object');
		expect(res.body).to.have.property(
			'message',
			'Hello! Welcome to My blog :)',
		);
	});
	it('should test unavailable routes', async () => {
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
			.send(tester2);
		const res = await chai
			.request(app)
			.post('/api/auth/login')
			.send({ email: 'hailu@gmail.com', password: 'Tester@123' });
		expect(res.status).to.be.equal(404);
		expect(res.body).to.have.property('success', false);
		expect(res.body).to.have.property('message', 'User Not found');
	});
	it('should validate login.', async () => {
		const signup = await chai
			.request(app)
			.post('/api/auth/register')
			.send(tester);
		const res = await chai
			.request(app)
			.post('/api/auth/login')
			.send({ password: 'Tester@123' });
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
			.send(emptyEmail);
		expect(res.status).to.be.equal(400);
		expect(res.body).to.have.property('success', false);
	});
	it('should validate blog creation with empty or lower content.', async () => {
		const signup = await chai
			.request(app)
			.post('/api/auth/register')
			.send(tester3);
		const signin = await chai
			.request(app)
			.post('/api/auth/login')
			.send({ email: tester3.email, password: 'Tester@123' });
		const token = `Bearer ${signin.body.data.token}`;
		const res = await chai
			.request(app)
			.post('/api/blogs')
			.set('auth', token)
			.field('title', mockBlog.title)
			.field('content', 'Hmnjb bhknub vyukyu vuykbyvh')
			.attach('image', path.resolve(__dirname, './mocks/pro.jpg'));
		expect(res.status).to.be.equal(400);
		expect(res.body).to.be.a('object');
		expect(res.body).to.have.property('success', false);
		expect(res.body).to.have.property(
			'message',
			'Validation error: Blog content must be atleast 250 characters!',
		);
	});
	it('should validate blog creation with empty or lower title.', async () => {
		const signup = await chai
			.request(app)
			.post('/api/auth/register')
			.send(tester3);
		const signin = await chai
			.request(app)
			.post('/api/auth/login')
			.send({ email: tester3.email, password: 'Tester@123' });
		const token = `Bearer ${signin.body.data.token}`;
		const res1 = await chai
			.request(app)
			.post('/api/blogs')
			.set('auth', token)
			.field('title', ' ')
			.field('content', 'Hmnjb bhknub vyukyu vuykbyvh')
			.attach('image', path.resolve(__dirname, './mocks/pro.jpg'));
		expect(res1.status).to.be.equal(400);
		expect(res1.body).to.be.a('object');
		expect(res1.body).to.have.property('success', false);
		expect(res1.body).to.have.property(
			'message',
			'Validation error: Please Add a title to your blog of atleast 10 characters!',
		);
	});
	it('should validate blog update with empty or lower lenght title.', async () => {
		const signup = await chai
			.request(app)
			.post('/api/auth/register')
			.send(tester3);
		const signin = await chai
			.request(app)
			.post('/api/auth/login')
			.send({ email: tester3.email, password: 'Tester@123' });
		const token = `Bearer ${signin.body.data.token}`;
		const mock = await chai
			.request(app)
			.post('/api/blogs')
			.set('auth', token)
			.send(mockBlog);

		const id = mock.body.data._id;
		const res2 = await chai
			.request(app)
			.patch(`/api/blogs/${id}`)
			.set('auth', token)
			.send(mockblog3);
		expect(res2.status).to.be.equal(400);
		expect(res2.body).to.be.a('object');
		expect(res2.body).to.have.property(
			'message',
			'Validation error: Title must be atleast 10 characters!',
		);
	});
	it('should validate blog update with empty or lower content.', async () => {
		const signup = await chai
			.request(app)
			.post('/api/auth/register')
			.send(tester3);
		const signin = await chai
			.request(app)
			.post('/api/auth/login')
			.send({ email: tester3.email, password: 'Tester@123' });
		const token = `Bearer ${signin.body.data.token}`;
		const res = await chai
			.request(app)
			.post('/api/blogs')
			.set('auth', token)
			.field('title', mockBlog.title)
			.field('content', mockBlog.content)
			.attach('image', path.resolve(__dirname, './mocks/pro.jpg'));
		const res1 = await chai
			.request(app)
			.patch(`/api/blogs/${res.body.data._id}`)
			.set('auth', token)
			.field('title', mockBlog.title)
			.field('content', ' ');
		expect(res1.status).to.be.equal(400);
		expect(res1.body).to.be.a('object');
		expect(res1.body).to.have.property('success', false);
		expect(res1.body).to.have.property(
			'message',
			'Validation error: Blog content must be atleast 250 characters!',
		);
	});
});
