const request = require('supertest');
// const {User} = require('../../src/app/models');
const factory = require('../factories');

const truncate = require('../utils/truncate');

const app = require('../../src/app');

describe('Authentication', () => {
	beforeEach(async () => {
		await truncate();
	});

	it('should authenticate with valid credentials', async () => {
		const user = await factory.create('User', {
			password: '19971205'
		});

		const response = await request(app)
			.post('/sessions')
			.send({
				email: user.email,
				password: '19971205'
			});

		expect(response.status).toBe(200);
	});

	it('should not authenticate with invalid credentials', async () => {

		const user = await factory.create('User', {
			password: '123123'
		});

		const response = await request(app)
			.post('/sessions')
			.send({
				email: user.email,
				password: 'senha_errada'
			});

		expect(response.status).toBe(401);

	});

	it('should return JWT Token when authenticated', async () => {
		const user = await factory.create('User', {
			password: '123123'
		});

		const response = await request(app)
			.post('/sessions')
			.send({
				email: user.email,
				password: '123123'
			});

		expect(response.body).toHaveProperty("token");
	});

	it('Should be able to access private routes when authenticated', async () => {
		const user = await factory.create('User', {
			password: '123123'
		});

		const response = await request(app)
			.get('/dashboard')
			.set('Authorization', `Bearer ${user.generateToken()}`);

		expect(response.status).toBe(200);
	});

	it('Should NOT be able to access private routes without JWT', async () => {
		const user = await factory.create('User', {
			password: '123123'
		});

		const response = await request(app)
			.get('/dashboard');

		expect(response.status).toBe(401);
	});


	it('Should NOT be able to access private routes with INVALID JWT', async () => {
		const user = await factory.create('User', {
			password: '123123'
		});

		const response = await request(app)
			.get('/dashboard')
			.set('Authorization', `Bearer afrdads`);

		expect(response.status).toBe(401);
	});
});