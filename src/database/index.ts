import mongoose from "mongoose";
import chalk from "chalk";

import { Connection } from "../@types";
import { BaseError } from "../errors";

class Database {
  private readonly connection: Connection = { value: process.env.CONNECTION as string };

  async start(): Promise<void> {
    try {
      if (!this.connection.value)
        throw new BaseError("Database connection error.");

      await mongoose.connect(this.connection.value);

      console.log(chalk.green("Connected to the database."));
    } catch (error: any) {
      console.log(`${error.name}: ${chalk.red(error.message)}`);
    }
  }
}

export default Database;