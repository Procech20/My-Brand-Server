// import mongoose from 'mongoose'
import mocha from 'mocha';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import User from '../models/user';

const { it, describe, beforeEach, afterEach } = mocha;

const tester = {
	email: 'tester@techblogs.pro',
	password: 'Tester@123',
	firstName: 'James',
	surName: 'Doe',
};

chai.expect();
chai.use(chaiHttp);

describe('Testing Auth routes', () => {
	beforeEach(async () => {
		await User.deleteMany({
			where: { email: { $not: ['tester@techblogs.pro'] } },
		});
	});
	afterEach(async () => {
		await User.deleteMany({
			where: { email: { $not: ['tester@techblogs.pro'] } },
		});
	});
	it('should register, login and get logged in user.', async () => {
		const res = await chai.request(app).post('/api/auth/register').send(tester);
		expect(res.status).to.be.equal(201);
		expect(res.body).to.have.property(
			'message',
			'Successfully Registered a user',
		);
	});
	it('should login user.', async () => {
		const res = await chai.request(app).post('/api/auth/register').send(tester);
		const res1 = await chai
			.request(app)
			.post('/api/auth/login')
			.send({ email: tester.email, password: tester.password });
		expect(res1.status).to.be.equal(200);
		expect(res1.body).to.have.property('message', 'User login successful :)');
	});
	it('should get logged in user.', async () => {
		const res = await chai.request(app).post('/api/auth/register').send(tester);
		const res1 = await chai
			.request(app)
			.post('/api/auth/login')
			.send({ email: tester.email, password: tester.password });

		const token = `Bearer ${res1.body.data.token}`;
		const res2 = await chai.request(app).get('/api/auth/me').set('auth', token);
		expect(res2.status).to.be.equal(200);
		expect(res2.body).to.have.property('message', 'User is logged in!');
	});
});
