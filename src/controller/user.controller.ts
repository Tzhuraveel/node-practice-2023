import { NextFunction, Request, Response } from "express";

import { ESmsAction } from "../enum";
import { ApiError } from "../error";
import { smsService, userService } from "../service";
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
      throw new ApiError(e.message, e.status);
    }
  }
  public async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<IUser>> {
    try {
      const { id } = req.res.locals;
      const user = await userService.getById(id);

      return res.status(200).json(user);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
  public async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.res.locals;
      await userService.delete(id);

      return res.status(204).sendStatus(204);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
  public async changePassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<string>> {
    try {
      const { jwtPayload } = req.res.locals.tokens;
      const { oldPassword, newPassword } = req.body;

      await userService.changePassword(
        jwtPayload._id,
        oldPassword,
        newPassword
      );

      await smsService.sendSms("+380632584573", ESmsAction.CHANGE_PASSWORD);

      return res.json("Password was change").status(200);
    } catch (e) {
      next(e);
    }
  }
}

export const userController = new UserController();
