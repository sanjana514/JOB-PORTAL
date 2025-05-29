import jwt from 'jsonwebtoken';
import { generateAuthToken } from './auth.utils';

// Store original SECRET_KEY and temporarily modify it for tests
const originalSecretKey = process.env.SECRET_KEY;

describe('Auth Utils - generateAuthToken', () => {
    const testUserId = 'testUserId123';

    beforeAll(() => {
        // Ensure SECRET_KEY is set for most tests, can be overridden per test
        process.env.SECRET_KEY = 'test-secret-key';
    });

    afterAll(() => {
        // Restore original SECRET_KEY after all tests
        process.env.SECRET_KEY = originalSecretKey;
    });

    it('should generate a valid JWT token when SECRET_KEY is provided', () => {
        const token = generateAuthToken(testUserId);
        expect(token).toEqual(expect.any(String));

        // Verify the token
        const decoded = jwt.verify(token, process.env.SECRET_KEY!) as { userId: string; iat: number; exp: number };
        expect(decoded.userId).toBe(testUserId);
        expect(decoded.iat).toEqual(expect.any(Number));
        expect(decoded.exp).toEqual(expect.any(Number));
    });

    it('should throw an error if SECRET_KEY is not defined', () => {
        delete process.env.SECRET_KEY; // Temporarily remove SECRET_KEY
        expect(() => generateAuthToken(testUserId)).toThrow("SECRET_KEY is not defined in environment variables");
        process.env.SECRET_KEY = 'test-secret-key'; // Restore for other tests
    });

    it('should generate a token that expires in approximately 10 hours', () => {
        const token = generateAuthToken(testUserId);
        const decoded = jwt.verify(token, process.env.SECRET_KEY!) as { userId: string; iat: number; exp: number };
        const tenHoursInSeconds = 10 * 60 * 60;
        // Check if the expiration is within a reasonable range (e.g., +/- 5 seconds for clock skew)
        expect(decoded.exp - decoded.iat).toBeCloseTo(tenHoursInSeconds, -1); // -1 means a precision of 10 seconds
    });
}); 