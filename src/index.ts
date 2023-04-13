import express from "express";

import Database from "./database/";
import routes from "./routes";
import env from "./utils/environment";
import { access } from "./middlewares";

const app = express();
access(app);
routes(app);

app.listen(env.PORT, () => {
  console.log(`Server open on http://localhost:${env.PORT}`);

  const database = new Database();
  database.start();
});