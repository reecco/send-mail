import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

import User from "../models/User";
import TokenModel from "../models/Token";
import { ValidateError, NotFoundError, UnauthorizedError, RequestError } from "../errors/";
import { sendToken, templateRecover } from "../utils/email";

class ValidationController {
  public async validateRegistration(req: Request, res: Response, next: NextFunction) {
    const { token } = req.params;

    try {
      const isUsed = await TokenModel.find({ value: token });

      if (isUsed.length === 0)
        throw new NotFoundError("Token not found.");

      if (isUsed[0].used) {
        await TokenModel.findByIdAndDelete(isUsed[0].id);
        throw new UnauthorizedError("Token has already been used.");
      }

      const id = isUsed[0].user_id;

      const result = await Promise.all([
        await User.findByIdAndUpdate(id, { verified: true }),
        await TokenModel.findByIdAndDelete(isUsed[0].id)
      ]);

      if (result.length !== 2)
        throw new ValidateError("An error occurred while validating registration.");

      return res.status(201).json({ message: "Successfully verified user.", code: 201 });
    } catch (error) {
      next(error);
    }
  }

  public async recoverPassword(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body;

    try {
      if (!email)
        throw new RequestError("Invalid request.");

      const user = await User.find({ email });

      if (user.length === 0)
        return res.status(201).json({ message: "Password recovery email sent. Check your inbox.", code: 201 });

      const token = uuidv4();
      const url = "https://send-mail-e7ec.onrender.com/validate-recover/" + token;

      Promise.all([
        TokenModel.create({ user_id: user[0].id, value: token, used: false }),
        sendToken({
          title: "(Do not answer. automatic email.)",
          toEmail: email,
          name: `Hi ${user[0].name}! Check your email to retrieve your password.`,
          text: templateRecover(url)
        })
      ])

      return res.status(201).json({ message: "Password recovery email sent. Check your inbox.", code: 201 });
    } catch (error) {
      next(error);
    }
  }

  public async validateRecovery(req: Request, res: Response, next: NextFunction) {
    const { token } = req.params;
    const { password } = req.body;

    try {
      if (!token || !password)
        throw new RequestError("Invalid request.");

      const isUsed = await TokenModel.find({ value: token });

      if (isUsed.length === 0)
        throw new NotFoundError("Token not found.");

      if (isUsed[0].used) {
        await TokenModel.findByIdAndDelete(isUsed[0].id);
        throw new UnauthorizedError("The token has already been used.");
      }

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      Promise.all([
        TokenModel.findOneAndDelete({ user_id: isUsed[0].user_id }),
        User.findByIdAndUpdate(isUsed[0].user_id, { password: hash })
      ]);

      return res.status(201).json({ message: "Password changed successfully.", code: 201 });
    } catch (error) {
      next(error);
    }
  }
}

export default new ValidationController();