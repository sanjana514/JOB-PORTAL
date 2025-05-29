import '@jest/globals';
import request from 'supertest';
import { app } from '../app';
import { User } from '../models/user.model';
import { Job } from '../models/job.model';
import { Company } from '../models/company.model';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

describe('Job Tests', () => {
    let authToken: string;
    let companyId: string;
    let userId: string;
    let userIdCookie: string;

    const testUser = {
        fullname: 'Test User',
        email: 'test@example.com',
        phoneNumber: 1234567890,
        password: 'password123',
        role: 'recruiter',
    };

    const testCompany = {
        name: 'Test Company',
        description: 'Test company description',
        location: 'Test Location',
        website: 'https://test.com',
    };

    const testJob = {
        title: 'Software Engineer',
        description: 'Test job description',
        requirements: 'Node.js,TypeScript',
        salary: 100000,
        experience: 2,
        location: 'Remote',
        jobType: 'Full-time',
        position: 1,
    };

    beforeEach(async () => {
        await User.deleteMany({});
        await Job.deleteMany({});
        await Company.deleteMany({});

        const hashedPassword = await bcrypt.hash(testUser.password, 10);
        const user = await User.create({
            ...testUser,
            password: hashedPassword
        });
        userId = user._id.toString();

        const company = await Company.create({
            ...testCompany,
            userId: userId
        });
        companyId = company._id.toString();

        await User.findByIdAndUpdate(userId, {
            profile: {
                company: companyId
            }
        });

        const loginRes = await request(app)
            .post('/api/v1/user/login')
            .send({
                email: testUser.email,
                password: testUser.password,
                role: testUser.role,
            });

        authToken = loginRes.body.user.token;
        userIdCookie = `userId=${loginRes.body.user._id}`;
    });

    describe('POST /api/v1/job/post', () => {
        it('should create a new job successfully', async () => {
            const jobData = {
                ...testJob,
                companyId: companyId
            };

            const res = await request(app)
                .post('/api/v1/job/post')
                .set('Cookie', [`token=${authToken}`, userIdCookie])
                .send(jobData);

            expect(res.status).toBe(201);
            expect(res.body.job).toHaveProperty('title', testJob.title);
            expect(res.body.job).toHaveProperty('description', testJob.description);
        });

        it('should not create job without authentication', async () => {
            const jobData = {
                ...testJob,
                companyId: companyId
            };
            const res = await request(app)
                .post('/api/v1/job/post')
                .send(jobData);

            expect(res.status).toBe(401);
        });

        it('should not create job with missing required fields', async () => {
            const res = await request(app)
                .post('/api/v1/job/post')
                .set('Cookie', [`token=${authToken}`, userIdCookie])
                .send({
                    title: 'Software Engineer',
                });

            expect(res.status).toBe(400);
        });
    });

    describe('GET /api/v1/job/get', () => {
        beforeEach(async () => {
            const jobData = {
                ...testJob,
                companyId: companyId
            };
            await request(app)
                .post('/api/v1/job/post')
                .set('Cookie', [`token=${authToken}`, userIdCookie])
                .send(jobData);
        });

        it('should get all jobs', async () => {
            const res = await request(app)
                .get('/api/v1/job/get')
                .set('Cookie', [`token=${authToken}`]);

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body.jobs)).toBe(true);
            expect(res.body.jobs.length).toBeGreaterThan(0);
            expect(res.body.jobs[0]).toHaveProperty('title', testJob.title);
        });

        it('should get job by id', async () => {
            const jobsRes = await request(app)
                .get('/api/v1/job/get')
                .set('Cookie', [`token=${authToken}`]);

            const jobId = jobsRes.body.jobs[0]._id;

            const res = await request(app)
                .get(`/api/v1/job/get/${jobId}`)
                .set('Cookie', [`token=${authToken}`]);

            expect(res.status).toBe(200);
            expect(res.body.job).toHaveProperty('title', testJob.title);
            expect(res.body.job).toHaveProperty('description', testJob.description);
        });

        it('should return 404 if job id does not exist', async () => {
            const nonExistentJobId = new mongoose.Types.ObjectId().toString();
            const res = await request(app)
                .get(`/api/v1/job/get/${nonExistentJobId}`)
                .set('Cookie', [`token=${authToken}`]);

            expect(res.status).toBe(404);
        });
    });
}); 