import { NextFunction, Request, Response } from "express";

import { EEmailAction } from "../enum";
import {
  authService,
  emailService,
  passwordService,
  userService,
} from "../service";
import { ITokenPair } from "../type";

class AuthController {
  public async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { password } = req.body;
      const hashedPassword = await passwordService.hash(password);

      await userService.create({ ...req.body, password: hashedPassword });
      await emailService.sendMail(req.body, EEmailAction.WELCOME, { password });

      return res.status(201).sendStatus(201);
    } catch (e) {
      next(e);
    }
  }
  public async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<ITokenPair>> {
    try {
      const user = req.res.locals.user;
      const { password } = req.body;

      const tokenPair = await authService.login(user, password);

      return res.status(201).json(tokenPair);
    } catch (e) {
      next(e);
    }
  }
  public async refresh(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<ITokenPair>> {
    try {
      const tokens = req.res.locals.tokens;

      const tokenPair = await authService.refresh(
        tokens.jwtPayload,
        tokens.tokenInfo
      );

      return res.json(tokenPair).status(200);
    } catch (e) {
      next(e);
    }
  }

  public async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.res.locals.user;

      await authService.forgotPassword(user);

      return res.sendStatus(200);
    } catch (e) {
      next(e);
    }
  }
  public async updateForgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { password } = req.body;
      const { tokenInfo } = req.res.locals.tokens;

      await authService.updateForgotPassword(
        password,
        tokenInfo._user_id,
        tokenInfo.actionToken
      );
      return res.sendStatus(200);
    } catch (e) {
      next(e);
    }
  }
}
export const authController = new AuthController();
