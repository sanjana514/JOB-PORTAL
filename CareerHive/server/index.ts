import { app } from "./app";
import connectDB from "./utils/db";
import cors from "cors";

const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173', // Fallback for local
  'https://career-hive-web-seven.vercel.app' // Explicitly add your Vercel URL
];
if (process.env.NODE_ENV === 'production' && process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
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

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running at port ${PORT}`);
});

console.log("App is running!");
