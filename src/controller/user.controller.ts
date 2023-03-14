import { NextFunction, Request, Response } from "express";

import { ApiError } from "../error";
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
      next(new ApiError(e.message, e.status));
    }
  }
  public getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Response<IUser> {
    try {
      const { foundUser } = req.res.locals;
      return res.status(200).json(foundUser);
    } catch (e) {
      next(new ApiError(e.message, e.status));
    }
  }
  public async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<IUser[]>> {
    try {
      const { userId } = req.params;
      await userService.delete(userId);
      return res.status(200).sendStatus(200);
    } catch (e) {
      next(new ApiError(e.message, e.status));
    }
  }
  public async update(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<IUser[]>> {
    try {
      const { foundUser } = req.res.locals;
      await userService.update(foundUser._id, foundUser);
      return res.status(200).sendStatus(200);
    } catch (e) {
      next(new ApiError(e.message, e.status));
    }
  }
}

export const userController = new UserController();
