import jwt from 'jsonwebtoken';

export const generateAuthToken = (userId: string): string => {
    if (!process.env.SECRET_KEY) {
        throw new Error("SECRET_KEY is not defined in environment variables");
    }
    const tokenData = { userId };
    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
        expiresIn: "10hr",
    });
    return token;
}; 