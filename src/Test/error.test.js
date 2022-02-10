import mongoose from 'mongoose';
import mocha from 'mocha';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import path from 'path';
import Blog from '../Database/models/blog';
import User from '../Database/models/user';
import app from '../index';
import {
	mockBlog,
	mockblog,
	mockblog2,
	mockblog3,
	mockblog4,
} from './mocks/blogs.mock';
import {
	mockAdmin,
	mockUser,
	mockUser1,
	mockUser2,
	mockUser3,
	mockuser,
} from './mocks/users.mock';

const { $not } = 'mongodb';

export const mockcreator = {
	email: 'creator@techblogs.pro',
	password: 'Creator@123',
	firstName: 'James',
	surName: 'Doe',
};
export const mockadmin = {
	email: 'admin@techblogs.pro',
	password: 'Admin@123',
};

const tester = {
	email: 'john@techblogs.pro',
	password: 'Tester@123',
	firstName: 'John',
	surName: 'Doe',
	role: 'Admin',
};
const tester2 = {
	email: 'jane@techblogs.pro',
	password: 'Tester@123',
	firstName: 'Jane',
	surName: 'Doe',
	role: 'Admin',
};
const tester3 = {
	firstName: 'Josh',
	surName: 'Doe',
	email: 'josh@techblogs.pro',
	password: 'Tester@123',
	role: 'Admin',
};

const { it, describe, beforeEach, afterEach } = mocha;

chai.expect();
chai.use(chaiHttp);

describe('Testing Blog errors', () => {
	beforeEach(async () => {
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
	});
	it('should Check all token errors related to blogs.', async () => {
		const res1 = await chai
			.request(app)
			.post('/api/blogs')
			.set('auth', '')
			.send(mockBlog);
		expect(res1.status).to.be.equal(400);
		expect(res1.body).to.have.property('success', false);
		expect(res1.body).to.have.property(
			'message',
			'No token provided or incomplete token',
		);
		const res2 = await chai
			.request(app)
			.post('/api/blogs')
			.set('autho', token)
			.send(mockBlog);
		expect(res2.status).to.be.equal(500);
		expect(res2.body).to.have.property('success', false);
		expect(res2.body).to.have.property(
			'message',
			"Error while checking token! Cannot read properties  of undefined (reading 'split')",
		);
		const res3 = await chai
			.request(app)
			.post('/api/blogs'.set('auth', token))
			.send(mockBlog);
		expect(res3.status).to.be.equal(403);
		expect(res3.body).to.have.property('success', false);
		expect(res3.body).to.have.property(
			'message',
			'Only admin allowed to perform such action.',
		);
	});
	it('should Check all Validation errors related to blogs.', async () => {
		const signup = await chai
			.request(app)
			.post('/api/auth/register')
			.send(tester2);
		const signin = await chai.request(app).post('/api/auth/login').send({
			email: signup.body.data.email,
			password: signup.body.data.password,
		});
		const token = `Bearer ${signin.body.data.token}`;
		const res4 = await chai
			.request(app)
			.post('/api/blogs')
			.set('auth', token)
			.send(mockblog);
		expect(res4.status).to.be.equal(400);
		expect(res4.body).to.have.property('success', false);
		expect(res4.body).to.have.property(
			'message',
			'Validation error: Please Add a title to your blog of atleast 10 characters!',
		);
		const res5 = await chai
			.request(app)
			.post('/api/blogs')
			.set('auth', token)
			.send(mockblog2);
		expect(res5.status).to.be.equal(400);
		expect(res5.body).to.have.property('success', false);
		expect(res5.body).to.have.property(
			'message',
			'Validation error: Please describe your blog in atleast 250 characters!',
		);
		const res6 = await chai
			.request(app)
			.post('/api/blogs')
			.set('auth', token)
			.send(mockblog3);
		expect(res6.status).to.be.equal(400);
		expect(res6.body).to.have.property('success', false);
		expect(res6.body).to.have.property(
			'message',
			'Validation error: Please Add a title to your blog of atleast 10 characters!',
		);
		const res7 = await chai
			.request(app)
			.post('/api/blogs')
			.set('auth', token)
			.send(mockblog4);
		expect(res7.status).to.be.equal(400);
		expect(res7.body).to.have.property('success', false);
		expect(res7.body).to.have.property(
			'message',
			'Validation error: Please describe your blog in atleast 250 characters!',
		);
		const res8 = await chai.request(app).get('/api/blogs/jcyv');
		expect(res8.status).to.be.equal(404);
		expect(res8.body).to.have.property('success', false);
		expect(res8.body).to.have.property(
			'message',
			'Ooops! No such blog was found :(',
		);
		const res9 = await chai
			.request(app)
			.patch('/api/blogs/jcynm')
			.attach('image', path.resolve(__dirname, './mocks/crop.php.jpg'))
			.set('auth', token);
		expect(res9.status).to.be.equal(404);
		expect(res9.body).to.have.property(
			'message',
			'Ooops! No such blog was found :(',
		);
		const res10 = await chai
			.request(app)
			.delete('/api/blogs/jkkv')
			.set('auth', token);
		expect(res10.status).to.be.equal(404);
		expect(res10.body).to.have.property(
			'message',
			'Ooops! No such blog was found :(',
		);
	});
});
describe('Testing User errors', () => {
	it('should Check all token errors related to Users.', async () => {
		const signup = await chai.request(app).post('/api/auth/register').send({
			email: 'josh@techblog.pro',
			password: 'Josh@123',
			firstName: 'Josh',
			surName: 'Doe',
			role: 'Admin',
		});
		const signin = await chai.request(app).post('/api/auth/login').send({
			email: signup.body.data.email,
			password: signup.body.data.password,
		});
		const token = `Bearer ${signin.body.data.token}`;
		const res1 = await chai
			.request(app)
			.post('/api/users')
			.send(mockUser)
			.set('auth', '');
		expect(res1.status).to.be.equal(400);
		expect(res1.body).to.be.a('object');
		expect(res1.body).to.have.property('success', false);
		expect(res1.body).to.have.property(
			'message',
			'No token provided or incomplete token',
		);
		const res2 = await chai
			.request(app)
			.post('/api/users')
			.send(mockUser)
			.set('autho', token);
		expect(res2.status).to.be.equal(500);
		expect(res2.body).to.be.a('object');
		expect(res2.body).to.have.property('success', false);
		expect(res2.body).to.have.property(
			'message',
			"Error while checking token! Cannot read properties of undefined (reading 'split')",
		);
		const res3 = await chai
			.request(app)
			.post('/api/users')
			.send(mockUser)
			.set('auth', token);
		expect(res3.status).to.be.equal(403);
		expect(res3.body).to.be.a('object');
		expect(res3.body).to.have.property('success', false);
		expect(res3.body).to.have.property(
			'message',
			'Only admin allowed to perform such action.',
		);
	});
	it('should Check all Validation errors related to users.', async () => {
		const signup = await chai
			.request(app)
			.post('/api/auth/register')
			.send(tester);
		// console.log(signup.email);
		const signin = await chai.request(app).post('/api/auth/login').send({
			email: signup.body.data.email,
			password: signup.body.data.password,
		});
		const token = `Bearer ${signin.body.data.token}`;
		const res4 = await chai
			.request(app)
			.post('/api/users')
			.send(mockUser1)
			.set('auth', token);
		expect(res4.status).to.be.equal(400);
		expect(res4.body).to.be.a('object');
		expect(res4.body).to.have.property('success', false);
		expect(res4.body).to.have.property(
			'message',
			'Validation error: Surname can only contain letters and numbers',
		);
		const res5 = await chai
			.request(app)
			.post('/api/users')
			.send(mockUser2)
			.set('auth', token);
		expect(res5.status).to.be.equal(400);
		expect(res5.body).to.be.a('object');
		expect(res5.body).to.have.property('success', false);
		expect(res5.body).to.have.property(
			'message',
			'Validation error: Please Add a valid email address',
		);
		const res6 = await chai
			.request(app)
			.post('/api/users')
			.send(mockUser3)
			.set('auth', token);
		expect(res6.status).to.be.equal(400);
		expect(res6.body).to.be.a('object');
		expect(res6.body).to.have.property('success', false);
		expect(res6.body).to.have.property(
			'message',
			'Validation error: password must be atleast 8 characters with atleast one lowercase letter, one uppercase letter and a special character',
		);
		const res8 = await chai
			.request(app)
			.get('/api/users/jcyv')
			.set('auth', token);
		expect(res8.status).to.be.equal(404);
		expect(res8.body).to.be.a('object');
		expect(res8.body).to.have.property('success', false);
		expect(res8.body).to.have.property(
			'message',
			'No user found with such id :(',
		);
		const res9 = await chai
			.request(app)
			.patch('/api/users/jcyv')
			.set('auth', token);
		expect(res9.status).to.be.equal(404);
		expect(res9.body).to.be.a('object');
		expect(res9.body).to.have.property(
			'message',
			'Ooops! No user was found with the provided',
		);
		const res10 = await chai
			.request(app)
			.delete('/api/users/jcyv')
			.set('auth', token);
		expect(res10.status).to.be.equal(404);
		expect(res10.body).to.be.a('object');
		expect(res10.body).to.have.property(
			'message',
			'No user was found with such id :(',
		);
	});
});
