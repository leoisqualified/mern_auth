import mongoose from "mongoose";
import { env } from "../constants/env";

const connectDb = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1); // Exit the app if DB fails
  }
};

export default connectDb;
