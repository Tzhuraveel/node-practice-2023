import { NextFunction, Request, Response } from "express";

import { userService } from "../service/user.service";
import { ICommonResponse, IDeleteResponse, IUser } from "../types/user.types";

class UserController {
  public async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<ICommonResponse<IUser[]>>> {
    try {
      const users = await userService.getAll();
      return res.status(200).json(users);
    } catch (e) {
      next(e);
    }
  }
  public async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<ICommonResponse<IUser>>> {
    try {
      return res.status(200).json({
        message: "User found",
        user: res.locals,
      });
    } catch (e) {
      next(e);
    }
  }
  public async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<ICommonResponse<IUser>>> {
    try {
      await userService.create(req.body);
      return res.status(200).json({
        message: "User created",
        user: req.body,
      });
    } catch (e) {
      next(e);
    }
  }
  public async update(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<ICommonResponse<IUser>>> {
    try {
      const { userId } = req.params;
      const user = await userService.update(userId, req.body);
      return res.status(200).json({
        message: "User updated",
        user: user,
      });
    } catch (e) {
      next(e);
    }
  }
  public async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<IDeleteResponse>> {
    try {
      await userService.delete(req.params.userId);
      console.log("hello");
      return res.status(200).json({
        message: "User deleted",
      });
    } catch (e) {
      next(e);
    }
  }
}

export const userController = new UserController();
