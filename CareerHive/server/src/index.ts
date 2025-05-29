import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './../utils/db';
import userRoutes from './../routes/user.route';
import jobRoutes from './../routes/job.route';
import companyRoutes from './../routes/company.route';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
    process.env.CLIENT_URL || 'http://localhost:3000', // Fallback for local
    'https://career-hive-web-seven.vercel.app' // Explicitly add your Vercel URL
];
// Ensure CLIENT_URL from env is added if in production and defined
if (process.env.NODE_ENV === 'production' && process.env.CLIENT_URL) {
    if (allowedOrigins.indexOf(process.env.CLIENT_URL) === -1) { // Avoid duplicates
        allowedOrigins.push(process.env.CLIENT_URL);
    }
}

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));

// Routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/job', jobRoutes);
app.use('/api/v1/company', companyRoutes);


// Connect to database and start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

export { app }; 