import { NextFunction, Request, Response } from "express";

import { ETokenType } from "../enum";
import { ApiError } from "../error";
import { Token } from "../model";
import { tokenService } from "../service";

class AuthMiddleware {
  public async checkAccessToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const accessToken = req.get("Authorization");

      if (!accessToken) {
        next(new ApiError("No token", 401));
        return;
      }

      const jwtPayload = tokenService.checkToken(
        accessToken,
        ETokenType.access
      );
      const foundToken = await Token.findOne({ accessToken });

      if (!foundToken) {
        next(new ApiError("Token not valid", 401));
        return;
      }

      req.res.locals = { foundToken, jwtPayload };
      next();
    } catch (e) {
      next(e);
    }
  }
  public async checkRefreshToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const refreshToken = req.get("Authorization");

      if (!refreshToken) {
        next(new ApiError("No token", 401));
      }

      const jwtPayload = tokenService.checkToken(
        refreshToken,
        ETokenType.refresh
      );
      const foundToken = await Token.findOne({ refreshToken });

      if (!foundToken) {
        next(new ApiError("Token not valid", 401));
      }

      req.res.locals = { foundToken, jwtPayload };
      next();
    } catch (e) {
      next(e);
    }
  }
}

export const authMiddleware = new AuthMiddleware();
