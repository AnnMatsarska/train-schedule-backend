import * as dotenv from "dotenv";

dotenv.config();

export const appConfig = {
  port: parseInt(process.env.PORT || "3000"),
  nodeEnv: process.env.NODE_ENV || "development",

  jwt: {
    secret: process.env.JWT_SECRET || "default-secret-change-in-production",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },

  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  },

  api: {
    prefix: "/api",
    pagination: {
      defaultLimit: 10,
      maxLimit: 100,
    },
  },
};

export const isDevelopment = () => appConfig.nodeEnv === "development";
export const isProduction = () => appConfig.nodeEnv === "production";
