// import mongoose from 'mongoose'
import mocha from 'mocha';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
// import { mockAdmin, mockcreator } from './mocks/users.mock';
import User from '../Database/models/user';

const {
        it, describe, beforeEach, afterEach,
} = mocha;

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

// const signin = async (user) => {
//         const userData = await chai.request(app).post('/api/auth/login').send(user);
//                 console.log(userData);
//         const data = {
//                 email: `${userData.body.data.foundUser.email}`,
//                 password: 'Admin@123',
//                 token: `Bearer ${userData.body.data.token}`,
//         };
//         return data;
// };



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

                const signup = await chai.request(app).post('/api/auth/register').send(tester);
                // const signin = await chai.request(app).post('/api/auth/login').send({email: tester.email, password: tester.password });
                // console.log(signup);
                const res = await chai.request(app).post('/api/auth/login').send({ email: tester.email, password: tester.password });
                expect(res.status).to.be.equal(200);
                expect(res.body).to.have.property('message', 'User login successful :)');

                const token =  `Bearer ${res.body.data.token}`
                const res1 = await chai.request(app).get('/api/auth/me').set('auth', token);
                expect(res1.status).to.be.equal(200);
                expect(res1.body).to.have.property('message', 'User is logged in!');

                const res2 = await chai.request(app).post('/api/auth/register').send(mockcreator);
                expect(res2.status).to.be.equal(201);
                expect(res2.body).to.have.property('message', 'Successfully Registered a user');
                // console.log(res2);
        });
});
