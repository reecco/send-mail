import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

import Key from "../models/Key";
import User from "../models/User";
import { NotFoundError, UnauthorizedError } from "../errors";
import { generateKey } from "../utils/key";

class KeyController {
  public async generate(req: Request, res: Response, next: NextFunction) {
    const { id } = req.body;

    try {
      const user = await User.findById(id);

      if (!user)
        throw new NotFoundError("User not found.");

      const keysAmount = await Key.find({ user_id: id });

      if (keysAmount.length == 5)
        throw new UnauthorizedError("You have reached the limit of generated keys.");

      const key = await generateKey(uuidv4());

      await Key.create({ user_id: id, value: key, created_date: new Date() });

      return res.status(201).json({ key });
    } catch (error) {
      next(error);
    }
  }

  public async generalList(req: Request, res: Response, next: NextFunction) {
    try {
      const keys = await Key.find();

      if (keys.length == 0)
        throw new NotFoundError('Keys not found.');

      return res.status(201).json({ keys, code: 201 });
    } catch (error) {
      next(error);
    }
  }

  public async userList(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    try {
      const keys = await Key.find({ user_id: id });

      if (keys.length === 0)
        throw new NotFoundError("Key not found.");

      return res.status(201).json({ keys, code: 201 });
    } catch (error) {
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    const { key } = req.body;

    try {
      const result = await Key.findOneAndDelete({ value: key });

      if (!result)
        throw new NotFoundError("Key not found.");

      res.status(201).json({ message: "Key deleted successfully.", code: 201 });
    } catch (error) {
      next(error);
    }
  }
}

export default new KeyController();