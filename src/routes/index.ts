import { Express, Request, Response, json } from "express";

import user from "./user.routes";
import key from "./key.routes";
import validation from "./validation.routes";
import email from "./email.routes";
import { errors } from "../middlewares";

export default (app: Express): void => {
  app.route("/").get((req: Request, res: Response) => {
    res.status(200).json({ message: "Email API", code: 200 });
  });

  app.use(
    json(),
    user,
    key,
    validation,
    email
  );

  app.use(errors);
}