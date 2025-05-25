import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Train } from "./entities/Train";
import { databaseConfig } from "./config/database";

export const AppDataSource = new DataSource({
  ...databaseConfig,
  entities: [User, Train],
  migrations: [],
  subscribers: [],
});
