import mongoose from 'mongoose';
import mocha from 'mocha';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import path from 'path';
import Blog from '../models/blog';
import User from '../models/user';
import app from '../index';
import {
	mockBlog,
	mockblog,
	mockblog2,
	mockblog3,
	mockblog4,
} from './mocks/blogs.mock';
import {
	mockCreator,
	mockUser,
	mockUser1,
	mockUser2,
	mockUser3,
} from './mocks/users.mock';

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
	email: 'johnny@techblogs.pro',
	password: 'Tester@123',
	firstName: 'Johnny',
	surName: 'Doe',
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
	it('should Check all token errors related to blogs.', async () => {
		const signup = await chai
			.request(app)
			.post('/api/auth/register')
			.send(mockcreator);
		const signin = await chai.request(app).post('/api/auth/login').send({
			email: signup.body.data.email,
			password: 'Creator@123',
		});
		const token = `Bearer ${signin.body.data.token}`;
		const res1 = await chai
			.request(app)
			.post('/api/blogs')
			.set('auth', '')
			.send(mockBlog);
		expect(res1.status).to.be.equal(400);
		expect(res1.body).to.have.property('success', false);
		expect(res1.body).to.have.property(
			'message',
			'Please log in to access the page.',
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
			"Error while checking token! Cannot read properties of undefined (reading 'split')",
		);
		const res3 = await chai
			.request(app)
			.post('/api/blogs')
			.set('auth', token)
			.send(mockBlog);
		expect(res3.status).to.be.equal(403);
		expect(res3.body).to.have.property('success', false);
		expect(res3.body).to.have.property(
			'message',
			"Ooops! You're not allowed to access this page.",
		);
	});
	it('should Check all Validation errors related to blogs.', async () => {
		const signup = await chai
			.request(app)
			.post('/api/auth/register')
			.send(tester);
		const signin = await chai.request(app).post('/api/auth/login').send({
			email: signup.body.data.email,
			password: 'Tester@123',
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
			'Validation error: Blog content must be atleast 250 characters!',
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
			'Validation error: Blog content must be atleast 250 characters!',
		);
		const res8 = await chai
			.request(app)
			.get('/api/blogs/1a2b3c4d5e6f')
			.set('auth', token);
		expect(res8.status).to.be.equal(404);
		expect(res8.body).to.have.property('success', false);
		expect(res8.body).to.have.property(
			'message',
			'Ooops! No such blog was found :(',
		);
		const res9 = await chai
			.request(app)
			.patch('/api/blogs/1a2b3c4d5e6f')
			.set('auth', token)
			.send({ title: 'Afterall that happened' });
		expect(res9.status).to.be.equal(404);
		expect(res9.body).to.have.property(
			'message',
			'Ooops! No such blog was found :(',
		);
		const res10 = await chai
			.request(app)
			.delete('/api/blogs/1a2b3c4d5e6f')
			.set('auth', token);
		expect(res10.status).to.be.equal(404);
		expect(res10.body).to.have.property('success', false);
		expect(res10.body).to.have.property(
			'message',
			'Ooops! No such blog was found :(',
		);
	});
});
describe('Testing User errors', () => {
	it('should Check all token errors related to Users.', async () => {
		const signup = await chai
			.request(app)
			.post('/api/auth/register')
			.send(tester);
		const signin = await chai.request(app).post('/api/auth/login').send({
			email: tester.email,
			password: tester.password,
		});
		const token = `Bearer ${signin.body.data.token}`;
		const signup2 = await chai
			.request(app)
			.post('/api/auth/register')
			.send(mockcreator);
		const signin2 = await chai.request(app).post('/api/auth/login').send({
			email: mockcreator.email,
			password: mockcreator.password,
		});
		const token2 = `Bearer ${signin2.body.data.token}`;
		const token3 = 'Bearer ';
		const res1 = await chai
			.request(app)
			.post('/api/users')
			.set('auth', token3)
			.send(mockUser);
		expect(res1.status).to.be.equal(400);
		expect(res1.body).to.be.a('object');
		expect(res1.body).to.have.property('success', false);
		expect(res1.body).to.have.property(
			'message',
			'Please log in to access the page.',
		);
		const res2 = await chai
			.request(app)
			.post('/api/users')
			.set('autho', token)
			.send(mockUser);
		expect(res2.status).to.be.equal(500);
		expect(res2.body).to.have.property('success', false);
		expect(res2.body).to.have.property(
			'message',
			"Error while checking token! Cannot read properties of undefined (reading 'split')",
		);
		const res3 = await chai
			.request(app)
			.post('/api/users')
			.set('auth', token2)
			.send(mockcreator);
		expect(res3.status).to.be.equal(403);
		expect(res3.body).to.be.a('object');
		expect(res3.body).to.have.property('success', false);
		expect(res3.body).to.have.property(
			'message',
			"Ooops! You're not allowed to access this page.",
		);
	});
	it('should Check all Validation errors related to users.', async () => {
		const signup2 = await chai
			.request(app)
			.post('/api/auth/register')
			.send(tester2);
		const signin2 = await chai.request(app).post('/api/auth/login').send({
			email: tester2.email,
			password: tester2.password,
		});
		const token2 = `Bearer ${signin2.body.data.token}`;
		const res4 = await chai
			.request(app)
			.post('/api/users')
			.set('auth', token2)
			.send(mockUser1);
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
			.set('auth', token2)
			.send(mockUser2);
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
			.set('auth', token2)
			.send(mockUser3);
		expect(res6.status).to.be.equal(400);
		expect(res6.body).to.be.a('object');
		expect(res6.body).to.have.property('success', false);
		expect(res6.body).to.have.property(
			'message',
			'Validation error: password must be atleast 8 characters with atleast one lowercase letter, one uppercase letter and a special character',
		);
		const res8 = await chai
			.request(app)
			.get('/api/users/61f9c550aea873a3002f254a')
			.set('auth', token2);
		expect(res8.status).to.be.equal(404);
		expect(res8.body).to.be.a('object');
		expect(res8.body).to.have.property('success', false);
		expect(res8.body).to.have.property(
			'message',
			'No user found with such id :(',
		);
		const res9 = await chai
			.request(app)
			.patch('/api/users/61f9c550aea873a3002f254a')
			.set('auth', token2);
		expect(res9.status).to.be.equal(404);
		expect(res9.body).to.be.a('object');
		expect(res9.body).to.have.property(
			'message',
			'Ooops! No such User was found :(',
		);
		const res10 = await chai
			.request(app)
			.delete('/api/users/6209224160f4b57b4788b6d9')
			.set('auth', token2);
		expect(res10.status).to.be.equal(404);
		expect(res10.body).to.be.a('object');
		expect(res10.body).to.have.property(
			'message',
			'Ooops! No user was found with the provided id!',
		);
	});
});
