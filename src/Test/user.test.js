import mongoose from 'mongoose'
import mocha from 'mocha';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import { mockAdmin, mockUser } from './mocks/users.mock';
import User from '../Database/models/user';

const { $not } = 'mongodb';

const {
        it, describe, beforeEach, afterEach,
} = mocha;
// const signin = async (user) => {
//         const userData = await chai.request(app).post('/api/auth/login').send(user);
//         const data = {
//                 id: `${userData.body.data.foundUser.id}`,
//                 token: `Bearer ${userData.body.data.token}`,
//         };
//         return data;
// };

const tester = {
        email: 'tester@techblogs.pro',
        password: 'Tester@123',
        firstName: 'James',
        surName: 'Doe',
        role: 'Admin'
};

const testerLogin = {
        email: 'tester@techblogs.pro',
        password: 'Tester@123',
}

chai.expect();
chai.use(chaiHttp);

describe('Testing Users routes', () => {
        // beforeEach(async () => {
        //         await User.deleteMany({
        //                 where: { email: { $not: ['admin@techblogs.pro', 'user@techblogs.pro'] } },
        //         });
        // });
        // afterEach(async () => {
        //         await User.deleteMany({
        //                 where: { email: { $not: ['admin@techblogs.pro', 'user@techblogs.pro'] } },
        //         });
        // });
        it('should Create, Update, Delete and Fetch all or single User.', async () => {
                const signup = await chai.request(app).post('/api/auth/register').send(tester);
                // console.log(signup.email);
                const signin = await chai.request(app).post('/api/auth/login').send(testerLogin);
                const token = `Bearer ${signin.body.data.token}`;
                const res = await chai.request(app).get('/api/users').set('auth', token);
                expect(res.status).to.be.equal(200);
                expect(res.body).to.have.property('message', 'All users retreived successfully');
                const res2 = await chai.request(app).post('/api/users').send(mockUser).set('auth', token);
                expect(res2.status).to.be.equal(201);
                expect(res2.body).to.have.property('message', 'Successfully created user');
                const res1 = await chai.request(app).get(`/api/users/${res2.body.data.id}`).set('auth', token);
                expect(res1.status).to.be.equal(200);
                expect(res1.body).to.have.property('message', 'successfully retrieved user');
                const res3 = await chai.request(app).patch(`/api/users/${res2.body.data.id}`).set('auth', token);
                expect(res3.status).to.be.equal(201);
                expect(res3.body).to.have.property('message', 'successfully updated user');
                const res4 = await chai.request(app).delete(`/api/users/${res2.body.data.id}`).set('auth', token);
                expect(res4.status).to.be.equal(200);
                expect(res4.body).to.have.property('message', 'Deleted successfully a user');
        });
});
