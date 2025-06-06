import { z } from "zod";
import dotenv from "dotenv";

dotenv.config(); // Load .env file

const envSchema = z.object({
  MONGO_URI: z.string().url(),
  PORT: z.string().optional(),
  JWT_SECRET: z.string().min(10),
  APP_ORIGIN: z.string().url(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables:", _env.error.format());
  process.exit(1); // Exit if env is invalid
}

export const env = _env.data;
