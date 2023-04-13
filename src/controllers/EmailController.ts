import { NextFunction, Request, Response } from "express";

import { NotFoundError, RequestError, UnauthorizedError } from "../errors";
import { Mail } from "../@types";
import Key from "../models/Key";
import User from "../models/User";
import { sendEmail } from "../utils/email";

class EmailController {
  public async send(req: Request<{}, {}, Mail>, res: Response, next: NextFunction) {
    const { name, text, fromEmail, toEmail } = req.body;
    const key = req.headers.authorization?.split(" ")[1];

    try {
      if (!name || !text || !fromEmail || !toEmail || !key)
        throw new RequestError("Invalid request.");

      const isValid = await Key.find({ value: key });

      if (isValid.length == 0)
        throw new UnauthorizedError("Invalid key.");

      const user = await User.findById(isValid[0].user_id);

      if (!user)
        throw new NotFoundError("User not found.");

      const limit = user.send_limit?.limit as number;

      if (new Date().getDate() == 1)
        await User.findByIdAndUpdate(user.id, { send_limit: { used: 0, limit } });

      const used = (user.send_limit?.used as number) + 1;

      if (used > limit)
        throw new UnauthorizedError("You have reached the monthly request limit.");

      await sendEmail({
        name,
        text,
        fromEmail,
        toEmail
      });

      await User.findByIdAndUpdate(user.id, { send_limit: { used: used, limit: limit } });

      return res.status(201).json({ message: "Email successfully sent.", code: 201 });
    } catch (error) {
      next(error);
    }
  }
}

export default new EmailController();