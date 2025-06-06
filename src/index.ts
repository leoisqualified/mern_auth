import express from "express";
import cors from "cors";
import { env } from "./constants/env";
import errorHandler from "./middleware/errorHandler";
import connectDb from "./config/db";
import authRoutes from './routes/authRoutes';

const app = express();
const PORT = env.PORT || 5000;

// connectDB
connectDb();


// middlewares
app.use(express.json());
app.use(
  cors({
    origin: env.APP_ORIGIN,
    credentials: true,
  })
);

app.get("/", (_req, res) => {
  res.send("Hello from TypeScript + Express");
});
app.use('/auth', authRoutes)

// ErrorHandler
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
