import '@jest/globals';
import request from 'supertest';
import { app } from '../app';
import { User } from '../models/user.model';
import bcrypt from 'bcryptjs';

describe('Authentication Tests', () => {
    const testUser = {
        fullname: 'Test User',
        email: 'test@example.com',
        phoneNumber: 1234567890,
        password: 'password123',
        role: 'student',
    };

    beforeEach(async () => {
        await User.deleteMany({});
    });

    describe('POST /api/v1/user/register', () => {
        it('should register a new user successfully', async () => {
            const res = await request(app)
                .post('/api/v1/user/register')
                .send(testUser);

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('message');
            expect(res.body.success).toBe(true);
        });

        it('should not register user with existing email', async () => {
            const hashedPassword = await bcrypt.hash(testUser.password, 10);
            await User.create({
                ...testUser,
                password: hashedPassword
            });

            const res = await request(app)
                .post('/api/v1/user/register')
                .send(testUser);

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message');
            expect(res.body.success).toBe(false);
        });
    });

    describe('POST /api/v1/user/login', () => {
        beforeEach(async () => {
            const hashedPassword = await bcrypt.hash(testUser.password, 10);
            await User.create({
                ...testUser,
                password: hashedPassword
            });
        });

        it('should login user successfully', async () => {
            const res = await request(app)
                .post('/api/v1/user/login')
                .send({
                    email: testUser.email,
                    password: testUser.password,
                    role: testUser.role,
                });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('user');
            expect(res.body.success).toBe(true);
        });

        it('should not login with wrong password', async () => {
            const res = await request(app)
                .post('/api/v1/user/login')
                .send({
                    email: testUser.email,
                    password: 'wrongpassword',
                    role: testUser.role,
                });

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message');
            expect(res.body.success).toBe(false);
        });
    });
}); 