import mongoose from 'mongoose';
import mocha from 'mocha';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import { mockUser } from './mocks/users.mock';
import User from '../Database/models/user';

const { it, describe, beforeEach, afterEach } = mocha;

const tester = {
	email: 'tester@techblogs.pro',
	password: 'Tester@123',
	firstName: 'James',
	surName: 'Doe',
	role: 'Admin',
};
const user = {
	email: 'user@techblogs.pro',
	password: 'User@123',
	firstName: 'James',
	surName: 'Doe',
};

chai.expect();
chai.use(chaiHttp);

describe('Testing Users routes', () => {
	beforeEach(async () => {
		await User.deleteMany({
			where: { email: { $not: ['admin@techblogs.pro', 'user@techblogs.pro'] } },
		});
	});
	afterEach(async () => {
		await User.deleteMany({
			where: { email: { $not: ['admin@techblogs.pro', 'user@techblogs.pro'] } },
		});
	});
	it('should Fetch all Users.', async () => {
		const signup = await chai
			.request(app)
			.post('/api/auth/register')
			.send(tester);
		const signin = await chai.request(app).post('/api/auth/login').send({
			email: signup.body.data.email,
			password: 'Tester@123',
		});
		const token = `Bearer ${signin.body.data.token}`;

		const res = await chai.request(app).get('/api/users').set('auth', token);
		expect(res.status).to.be.equal(200);
		expect(res.body).to.have.property(
			'message',
			'All users retreived successfully',
		);
	});
	it('should Create User.', async () => {
		const signup = await chai
			.request(app)
			.post('/api/auth/register')
			.send(tester);
		const signin = await chai.request(app).post('/api/auth/login').send({
			email: signup.body.data.email,
			password: 'Tester@123',
		});
		const token = `Bearer ${signin.body.data.token}`;

		const res2 = await chai
			.request(app)
			.post('/api/users')
			.set('auth', token)
			.send(user);
		expect(res2.status).to.be.equal(201);
		expect(res2.body).to.have.property('message', 'Successfully created user');
	});
	it('should Update User.', async () => {
		const signup = await chai
			.request(app)
			.post('/api/auth/register')
			.send(tester);
		const signin = await chai.request(app).post('/api/auth/login').send({
			email: signup.body.data.email,
			password: 'Tester@123',
		});
		const token = `Bearer ${signin.body.data.token}`;

		const res2 = await chai
			.request(app)
			.post('/api/users')
			.set('auth', token)
			.send(user);
		const mock = await User.findOne({ email: res2.body.data.email });
		const { _id } = mock;
		const res3 = await chai
			.request(app)
			.patch(`/api/users/${_id}`)
			.set('auth', token)
			.send({ firstName: 'Johnny' });
		expect(res3.status).to.be.equal(201);
		expect(res3.body).to.have.property('message', 'successfully updated user');
	});
	it('should Retrieve User.', async () => {
		const signup = await chai
			.request(app)
			.post('/api/auth/register')
			.send(tester);
		const signin = await chai.request(app).post('/api/auth/login').send({
			email: signup.body.data.email,
			password: 'Tester@123',
		});
		const token = `Bearer ${signin.body.data.token}`;

		const res2 = await chai
			.request(app)
			.post('/api/users')
			.set('auth', token)
			.send(user);

		const mock = await User.findOne({ email: res2.body.data.email });
		const { _id } = mock;

		const res1 = await chai
			.request(app)
			.get(`/api/users/${_id}`)
			.set('auth', token);
		expect(res1.status).to.be.equal(200);
		expect(res1.body).to.have.property(
			'message',
			'successfully retrieved user',
		);
	});
	it('should Delete User.', async () => {
		const signup = await chai
			.request(app)
			.post('/api/auth/register')
			.send(tester);
		const signin = await chai.request(app).post('/api/auth/login').send({
			email: signup.body.data.email,
			password: 'Tester@123',
		});
		const token = `Bearer ${signin.body.data.token}`;

		const res2 = await chai
			.request(app)
			.post('/api/users')
			.set('auth', token)
			.send(user);

		const mock = await User.findOne({ email: res2.body.data.email });
		const { _id } = mock;

		const res1 = await chai
			.request(app)
			.delete(`/api/users/${_id}`)
			.set('auth', token);
		expect(res1.status).to.be.equal(204);
		expect(res1.body).to.be.a('object');
	});
});
