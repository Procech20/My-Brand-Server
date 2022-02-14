import mocha from 'mocha';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import Querry from '../models/querry';
import User from '../models/user';

const { it, describe, beforeEach, afterEach } = mocha;

const tester = {
	email: 'tester@techblogs.pro',
	password: 'Tester@123',
	firstName: 'James',
	surName: 'Doe',
	role: 'Admin',
};
const querry = {
	email: 'user@techblogs.pro',
	names: 'Querry Tester',
	project: 'Querry Project',
	message: "Doens't matter",
};

chai.expect();
chai.use(chaiHttp);

describe('Testing Querry routes', () => {
	beforeEach(async () => {
		await Querry.deleteMany({});
	});
	afterEach(async () => {
		await Querry.deleteMany({});
	});
	beforeEach(async () => {
		await User.deleteMany({});
	});
	afterEach(async () => {
		await User.deleteMany({});
	});
	it('should Fetch all Querries.', async () => {
		const signup = await chai
			.request(app)
			.post('/api/auth/register')
			.send(tester);
		const signin = await chai.request(app).post('/api/auth/login').send({
			email: signup.body.data.email,
			password: 'Tester@123',
		});
		const token = `Bearer ${signin.body.data.token}`;

		const res = await chai.request(app).get('/api/querries').set('auth', token);
		expect(res.status).to.be.equal(200);
		expect(res.body).to.have.property(
			'message',
			'All querries retreived successfully',
		);
	});
	it('should Create Querry.', async () => {
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
			.post('/api/querries')
			.set('auth', token)
			.send(querry);
		expect(res2.status).to.be.equal(201);
		expect(res2.body).to.have.property(
			'message',
			'Successfully created querry',
		);
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
			.post('/api/querries')
			.set('auth', token)
			.send(querry);
		const res3 = await chai
			.request(app)
			.patch(`/api/querries/${res2.body.data._id}`)
			.set('auth', token)
			.send({ names: 'Tester Again' });
		expect(res3.status).to.be.equal(201);
		expect(res3.body).to.have.property(
			'message',
			'successfully updated Querry',
		);
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
			.post('/api/querries')
			.set('auth', token)
			.send(querry);

		const res1 = await chai
			.request(app)
			.get(`/api/querries/${res2.body.data._id}`)
			.set('auth', token);
		expect(res1.status).to.be.equal(200);
		expect(res1.body).to.have.property(
			'message',
			'successfully retrieved querry',
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
			.post('/api/querries')
			.set('auth', token)
			.send(querry);

		const res1 = await chai
			.request(app)
			.delete(`/api/querries/${res2.body.data._id}`)
			.set('auth', token);
		expect(res1.status).to.be.equal(204);
		expect(res1.body).to.be.a('object');
	});
});
