import mocha from 'mocha';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import path from 'path';
import app from '../index';
import { mockBlog } from './mocks/blogs.mock';
import { mockAdmin, wrongEmail, emptyEmail } from './mocks/users.mock';

const {
        it, describe,
} = mocha;

const signin = async (user) => {
        const userData = await chai.request(app).post('/api/auth/login').send(user);
        const data = {
                email: `${userData.body.data.foundUser.email}`,
                password: 'Admin123',
                token: `Bearer ${userData.body.data.token}`,
        };
        return data;
};

chai.expect();
chai.use(chaiHttp);

const mockuser = {
        surName: 'fyyhjh',
        email: 'testertest.test',
        password: 'User123',
};
const mockblog = { title: 'mngd' };

describe('Testing Welcome and test Error Route', () => {
        it('should Welcome a user to the api and test unavailable routes', async () => {
                const res = await chai.request(app).get('/');
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('message', 'Hello! Welcome to My blog :)');
                const res1 = await chai.request(app).get('/api/*');
                expect(res1.status).to.be.equal(404);
                expect(res1.body).to.be.a('object');
                expect(res1.body).to.have.property('message', 'route not found :(  .... Please try a valid route like : /api/blogs or /api/users');
        });
});

describe('Test all validation errors', () => {
        it('should check valid email for login.', async () => {
                const { email, password } = wrongEmail;
                const res = await chai.request(app).post('/api/auth/login').send({ email, password });
                expect(res.status).to.be.equal(404);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('message', 'User Not found');
        });
        it('should validate login.', async () => {
                const { email, password } = emptyEmail;
                const res = await chai.request(app).post('/api/auth/login').send({ email, password });
                expect(res.status).to.be.equal(400);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('message', 'Validation error: Email is required');
        });
        it('should validate signup.', async () => {
                const res = await chai.request(app).post('/api/auth/register').send(mockuser);
                expect(res.status).to.be.equal(400);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('success', false);
        });
        it('should validate blog creation and update.', async () => {
                const dummy = await signin(mockAdmin);
                const { token } = dummy;
                const re = await chai.request(app).post('/api/blogs').field('title', mockBlog.title).field('description', 'Hmnjb bhknub vyukyu vuykbyvh')
                        .attach('image', path.resolve(__dirname, './mocks/pro.jpg'))
                        .set('auth', token);
                const res = await chai.request(app).post('/api/blogs').field('title', 'nggg').field('description', 'Hmnjb bhknub vyukyu vuykbyvh')
                        .attach('image', path.resolve(__dirname, './mocks/pro.jpg'))
                        .set('auth', token);
                console.log(res.status);
                expect(res.status).to.be.equal(400);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('success', false);
                expect(res.body).to.have.property('message', 'Validation error: Please Add a title to your blog of atleast 10 characters!');
                const res1 = await chai.request(app).patch(`/api/blogs/${re.body.data.id}`).send(mockblog).set('auth', token);
                expect(res1.status).to.be.equal(400);
                expect(res1.body).to.be.a('object');
                expect(res1.body).to.have.property('message', 'Validation error: Title must be atleast 10 characters!');
        });
});
