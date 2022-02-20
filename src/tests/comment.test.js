import mocha from 'mocha';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import path from 'path';
import Sinon from 'sinon';
import Blog from '../models/blog';
import User from '../models/user';
import app from '../index';
import { mockBlog } from './mocks/blogs.mock';
import cloudinary from '../config/cloudinary';

const { it, describe, beforeEach, afterEach } = mocha;

chai.expect();
chai.use(chaiHttp);

const tester = {
	email: 'tester@techblogs.pro',
	password: 'Tester@123',
	firstName: 'James',
	surName: 'Doe',
	role: 'Admin',
};

describe('Testing Comment route', () => {
	const sandbox = Sinon.createSandbox();
	beforeEach(async () => {
		sandbox.stub(cloudinary, 'upload').resolves({
			url: 'wazaaaaa',
		});
		await Blog.deleteMany({
			where: {},
			truncate: true,
		});
	});
	afterEach(async () => {
		await Blog.deleteMany({
			where: {},
			truncate: true,
		});
		sandbox.restore();
	});
	beforeEach(async () => {
		await User.deleteMany({
			where: {},
			truncate: true,
		});
	});
	afterEach(async () => {
		await User.deleteMany({
			where: {},
			truncate: true,
		});
	});
	it('should create comment.', async () => {
		const signup = await chai
			.request(app)
			.post('/api/auth/register')
			.send(tester);
		const signin = await chai.request(app).post('/api/auth/login').send({
			email: signup.body.data.email,
			password: 'Tester@123',
		});
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
			.post(`/api/blogs/comments/${res.body.data._id}`)
			.set('auth', token)
			.send({ message: 'This is a comment' });
		expect(res1.status).to.be.equal(201);
		expect(res1.body).to.be.a('object');
		expect(res1.body).to.have.property('success', true);
		expect(res1.body).to.have.property('message');
	});
});
