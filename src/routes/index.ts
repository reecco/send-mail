import { Express, Request, Response, json } from "express";

import user from "./userRoutes";
import key from "./keyRoutes";
import validation from "./validationRoutes";
import email from "./emailRoutes";
import { errors } from "../middlewares";

export default (app: Express) => {
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