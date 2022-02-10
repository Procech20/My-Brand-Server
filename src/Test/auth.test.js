// import mongoose from 'mongoose'
import mocha from 'mocha';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
// import { mockAdmin, mockcreator } from './mocks/users.mock';
import User from '../Database/models/user';

const { it, describe, beforeEach, afterEach } = mocha;

const tester = {
	email: 'tester@techblogs.pro',
	password: 'Tester@123',
	firstName: 'James',
	surName: 'Doe',
};

const mockcreator = {
	email: 'creator@techblogs.pro',
	password: 'Creator@123',
	firstName: 'James',
	surName: 'Doe',
};

chai.expect();
chai.use(chaiHttp);

describe('Testing Auth routes', () => {
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
	it('should register, login and get logged in user.', async () => {
		const signup = await chai
			.request(app)
			.post('/api/auth/register')
			.send(tester);
		const res = await chai
			.request(app)
			.post('/api/auth/login')
			.send({
				email: signup.body.data.email,
				password: signup.body.data.password,
			});
		expect(res.status).to.be.equal(200);
		expect(res.body).to.have.property('message', 'User login successful :)');

		const token = `Bearer ${res.body.data.token}`;
		const res1 = await chai.request(app).get('/api/auth/me').set('auth', token);
		expect(res1.status).to.be.equal(200);
		expect(res1.body).to.have.property('message', 'User is logged in!');

		const res2 = await chai
			.request(app)
			.post('/api/auth/register')
			.send(mockcreator);
		expect(res2.status).to.be.equal(201);
		expect(res2.body).to.have.property(
			'message',
			'Successfully Registered a user',
		);
	});
});
