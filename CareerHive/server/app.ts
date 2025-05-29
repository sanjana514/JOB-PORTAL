import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import userRoute from "./routes/user.route";
import companyRoute from "./routes/company.route";
import jobRoute from "./routes/job.route";
import applicationRoute from "./routes/application.route";

dotenv.config({});

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// use env variable for cors origin
const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:3000";
const corsOptions = {
    origin: corsOrigin,
    credentials: true,
};

app.use(cors(corsOptions));

// api's
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

export { app }; 