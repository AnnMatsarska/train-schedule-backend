import * as dotenv from "dotenv";

dotenv.config();

export const databaseConfig = {
  type: "postgres" as const,
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "train_schedule_db",
  synchronize: process.env.NODE_ENV !== "production",
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
};
