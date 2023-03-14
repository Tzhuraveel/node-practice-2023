import { NextFunction, Request, Response } from "express";

import { authService } from "../service";
import { ITokenPair } from "../type/token.type";

class AuthController {
  public async register(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.register(req.body);

      res.sendStatus(201);
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
      const credential = req.body;
      const { foundUser } = req.res.locals;

      const tokenPair = await authService.login(credential, foundUser);

      return res.status(200).json(tokenPair);
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
      const { foundToken, jwtPayload } = req.res.locals;

      const tokenPair = await authService.refresh(jwtPayload, foundToken);

      return res.status(201).json(tokenPair);
    } catch (e) {
      next(e);
    }
  }
}

export const authController = new AuthController();
