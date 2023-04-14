import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import User from "../models/User";
import Key from "../models/Key";
import TokenModel from "../models/Token";
import env from "../utils/environment";
import { Register, RequestToken } from "../@types";
import { sendToken, templateRegister } from "../utils/email";
import { ValidateError, NotFoundError, UnauthorizedError, NotAllowedError, BaseError, RequestError } from "../errors/";

class UserController {
  public async register(req: Request<{}, {}, Register>, res: Response, next: NextFunction) {
    const { email, name, password, country } = req.body;

    try {
      // throw new NotAllowedError();

      if (!email || !name || !password || !country)
        throw new RequestError("Invalid request.");

      const userExists = await User.find({ email });

      if (userExists.length !== 0)
        throw new UnauthorizedError("Email already registered.");

      const token = uuidv4();
      const url = "https://send-mail-e7ec.onrender.com/verified/" + token;

      await sendToken({
        title: "(Do not answer. automatic email.)",
        toEmail: email,
        name: `Hi ${name}! Validate your email to complete the registration, please.`,
        text: templateRegister(url)
      });

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      const user = await User.create({
        email,
        name,
        password: hash,
        country,
        created_date: new Date(),
        verified: false,
        send_limit: {
          used: 0,
          limit: 50
        },
        image: null
      });

      const key = uuidv4();

      Promise.all([
        TokenModel.create({ user_id: user.id, value: token, used: false }),
        Key.create({ user_id: user.id, value: key, created_date: new Date() })
      ]);

      return res.status(201).json({ message: "Check your email to complete the registration.", code: 201 });
    } catch (error) {
      next(error);
    }
  }

  public async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    try {
      if (!email || !password)
        throw new RequestError("Invalid request.");

      const user = await User.find({ email });

      if (user.length === 0)
        throw new UnauthorizedError("Invalid email or password.");

      if (!bcrypt.compareSync(password, user[0].password as string))
        throw new UnauthorizedError("Invalid email or password.");

      if (!user[0].verified) {
        const token = await TokenModel.find({ user_id: user[0].id });

        if (token.length === 0)
          throw new NotFoundError("Token not found.");

        if (token[0].used) {
          const newToken = uuidv4();
          const url = "https://send-mail-e7ec.onrender.com/verified/" + newToken;

          Promise.all([
            TokenModel.findOneAndDelete({ user_id: user[0].id }),
            TokenModel.create({ user_id: user[0].id, value: newToken, used: false }),
            sendToken({
              title: "(Do not answer. automatic email.)",
              toEmail: email,
              name: `Hi ${user[0].name}! Validate your email to complete the registration, please.`,
              text: templateRegister(url)
            })
          ]).catch(error => {
            throw new ValidateError("An error occurred while logging in: " + error);
          });

          return res.status(201).json({ message: "A new verification email has been sent. Check your inbox.", code: 201 });
        }

        const url = "https://send-mail-e7ec.onrender.com/verified/" + token[0].value;

        await sendToken({
          title: "(Do not answer. automatic email.)",
          toEmail: email,
          name: `Hi ${user[0].name}! Validate your email to complete the registration, please.`,
          text: templateRegister(url)
        });

        return res.status(201).json({ message: "Verification email sent. Check your inbox.", code: 201 });
      }

      if (!env.SECRET_JWT)
        throw new BaseError('Internal server error.');

      jwt.sign({ id: user[0].id, email: user[0].email, name: user[0].name }, env.SECRET_JWT, { expiresIn: "1h" }, (error, data) => {
        if (error)
          throw new BaseError("An error occurred while generating token: " + error.message);

        return res.status(201).json({ data, code: 201 });
      });
    } catch (error) {
      next(error);
    }
  }

  public async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await User.find({}, "-password -image");

      if (users.length === 0)
        throw new NotFoundError("User not found.");

      return res.status(201).json({ users, code: 201 });
    } catch (error) {
      next(error);
    }
  }

  public async getUser(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(" ")[1] as string;

    try {
      const data: RequestToken | null = jwt.decode(token) as RequestToken;

      if (!data)
        throw new UnauthorizedError("Invalid token.");

      const user = await User.find({ email: data.email }, "-password");

      if (!user)
        throw new NotFoundError("User not found.");

      return res.status(201).json({
        user: {
          name: user[0].name,
          email: user[0].email,
          country: user[0].country,
          created_date: user[0].created_date,
          image: !user[0].image ? user[0].image : Buffer.from(user[0].image as Buffer).toString("base64")
        },
        code: 201
      });
    } catch (error) {
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    const { id } = req.body;

    try {
      if (!id)
        throw new RequestError("Invalid request.");

      const user = await User.findById(id);

      if (!user)
        throw new NotFoundError("User not found.");

      if (!bcrypt.compareSync(req.body.password, user.password as string))
        throw new UnauthorizedError("Invalid password.");

      const register: Register = {
        // email: req.body.email ? changeEmail(req.body.email) : user.email,
        name: req.body.name ? req.body.name : user.name,
        password: req.body.newPassword ? bcrypt.hashSync(req.body.newPassword, bcrypt.genSaltSync(10)) : user.password,
        country: req.body.country ? req.body.country : user.country
      };

      await User.findByIdAndUpdate(id, register);

      return res.status(201).json({ message: "Registration updated successfully.", code: 201 });
    } catch (error) {
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    const { id } = req.body;

    try {
      if (!id)
        throw new RequestError("Invalid request.");

      const user = await User.findByIdAndDelete(id);

      if (!user)
        throw new NotFoundError("User not found.");

      Promise.all([
        TokenModel.findOneAndDelete({ user_id: id }),
        Key.deleteMany({ user_id: id })
      ]);

      return res.status(201).json({ message: "Register deleted successfully.", code: 201 });
    } catch (error) {
      next(error);
    }
  }

  public async changeUserImage(req: Request, res: Response, next: NextFunction) {
    const { id } = req.body;
    const buffer = req.file?.buffer;

    try {
      if (!id)
        throw new RequestError("Invalid request.");

      const maxSizeInBytes: number = 75 * 1024;

      const fileSizeInBytes: number = req.file?.size as number;

      if (fileSizeInBytes > maxSizeInBytes)
        throw new UnauthorizedError("Image size exceeds allowed limit.");

      const user = await User.findByIdAndUpdate(id, { image: buffer ? buffer : Buffer.alloc(0) });

      if (!user)
        throw new NotFoundError("User not found.");

      return res.status(201).json({ message: "Image updated successfully.", code: 201 });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();