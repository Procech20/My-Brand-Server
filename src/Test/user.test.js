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
	it('should Create, Update, Delete and Fetch all or single User.', async () => {
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

		const res = await chai.request(app).get('/api/users').set('auth', token);
		expect(res.status).to.be.equal(200);
		expect(res.body).to.have.property(
			'message',
			'All users retreived successfully',
		);

		const res2 = await chai
			.request(app)
			.post('/api/users')
			.set('auth', token)
			.send(user);
		console.log(res2);
		expect(res2.status).to.be.equal(201);
		expect(res2.body).to.have.property('message', 'Successfully created user');

		const res1 = await chai
			.request(app)
			.get(`/api/users/${res2.body.data.id}`)
			.set('auth', token);
		expect(res1.status).to.be.equal(200);
		expect(res1.body).to.have.property(
			'message',
			'successfully retrieved user',
		);

		const res3 = await chai
			.request(app)
			.set('auth', token)
			.patch(`/api/users/${res2.body.data.id}`)
			.send({ firstName: 'Johnny' });
		expect(res3.status).to.be.equal(201);
		expect(res3.body).to.have.property('message', 'successfully updated user');
		const res4 = await chai
			.request(app)
			.set('auth', token)
			.delete(`/api/users/${res2.body.data.id}`);
		expect(res4.status).to.be.equal(200);
		expect(res4.body).to.have.property(
			'message',
			'Deleted successfully a user',
		);
	});
});
