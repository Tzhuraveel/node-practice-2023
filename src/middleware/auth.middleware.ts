import { NextFunction, Request, Response } from "express";

import { ETokenType } from "../enum";
import { ApiError } from "../error";
import { Action, Token } from "../model";
import { tokenService } from "../service";

class AuthMiddleware {
  public async checkAccessToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<void>> {
    try {
      const accessToken = req.get("Authorization");

      if (!accessToken) {
        next(new ApiError("No token", 401));
        return;
      }

      const jwtPayload = tokenService.checkToken(
        accessToken,
        ETokenType.accessToken
      );
      const tokenInfo = await Token.findOne({ accessToken });

      if (!tokenInfo) {
        next(new ApiError("This token not found", 400));
        return;
      }

      req.res.locals.tokens = { tokenInfo, jwtPayload };

      next();
    } catch (e) {
      next(e);
    }
  }
  public async checkRefreshToken(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const refreshToken = req.get("Authorization");

      if (!refreshToken) {
        next(new ApiError("No token", 401));
        return;
      }

      const jwtPayload = tokenService.checkToken(
        refreshToken,
        ETokenType.refreshToken
      );
      const tokenInfo = await Token.findOne({ refreshToken });

      if (!tokenInfo) {
        next(new ApiError("This token not found", 400));
        return;
      }

      req.res.locals.tokens = { tokenInfo, jwtPayload };

      next();
    } catch (e) {
      next(e);
    }
  }
  public async checkActionOrForgotToken(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const actionToken = req.params.token;

      if (!actionToken) {
        next(new ApiError("No token", 401));
        return;
      }

      const jwtPayload = tokenService.checkToken(
        actionToken,
        ETokenType.forgotToken
      );
      const tokenInfo = await Action.findOne({ actionToken });

      if (!tokenInfo) {
        next(new ApiError("This token not found", 400));
        return;
      }

      req.res.locals.tokens = { tokenInfo, jwtPayload };

      console.log(jwtPayload, tokenInfo);

      next();
    } catch (e) {
      next(e);
    }
  }
}

export const authMiddleware = new AuthMiddleware();
