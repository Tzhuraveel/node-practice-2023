import { NextFunction, Request, Response } from "express";

import { userService } from "../service";
import { IUser } from "../type";

class UserController {
  public async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<IUser[]>> {
    try {
      const users = await userService.getAll();

      return res.status(200).json(users);
    } catch (e) {
      next(e);
    }
  }
}

export const userController = new UserController();
