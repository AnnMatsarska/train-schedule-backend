import "reflect-metadata";
import express from "express";
import cors from "cors";
import { AppDataSource } from "./data-source";
import routes from "./routes";

import { appConfig } from "./config/app";

const app = express();

app.use(cors(appConfig.cors));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Train Schedule API is running!" });
});

app.use(appConfig.api.prefix, routes);

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected successfully");

    app.listen(appConfig.port, () => {
      console.log(`Server is running on port ${appConfig.port}`);
      console.log(`Environment: ${appConfig.nodeEnv}`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });
