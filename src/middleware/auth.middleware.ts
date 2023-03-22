import { NextFunction, Request, Response } from "express";

import { EActionTokenType, ETokenType } from "../enum";
import { ApiError } from "../error";
import { Action, OldPassword, Token } from "../model";
import { passwordService, tokenService } from "../service";

class AuthMiddleware {
  public checkToken(tokenType: ETokenType) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const token = req.get("Authorization");

        if (!token) {
          next(new ApiError("No token", 401));
          return;
        }

        const jwtPayload = tokenService.checkToken(token, tokenType);

        const tokenInfo = await Token.findOne({ [tokenType]: token });

        if (!tokenInfo) {
          next(new ApiError("This token not found", 400));
          return;
        }

        req.res.locals.token = { jwtPayload, tokenInfo };

        next();
      } catch (e) {
        next(e);
      }
    };
  }

  public checkActionToken(tokenType: EActionTokenType) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const actionToken = req.params.token;

        if (!actionToken) {
          next(new ApiError("No token", 401));
          return;
        }

        const jwtPayload = tokenService.checkToken(actionToken, tokenType);

        const tokenInfo = await Action.findOne({ actionToken });

        if (!tokenInfo) {
          next(new ApiError("Token not found", 400));
          return;
        }

        req.res.locals.token = { jwtPayload, tokenInfo };

        next();
      } catch (e) {
        next(e);
      }
    };
  }

  public async checkOldPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { tokenInfo } = req.res.locals.token;
      const { body } = req;

      const oldPasswords = await OldPassword.find({
        _user_id: tokenInfo._user_id,
      }).lean();

      if (oldPasswords.length === 0) {
        next();
        return;
      }

      await Promise.all([
        oldPasswords.map(async (model) => {
          const isMatched = await passwordService.compare(
            body.password,
            model.password
          );
          if (isMatched) {
            next(new ApiError("Password is the same is your old", 409));
            return;
          }
        }),
      ]);

      next();
    } catch (e) {
      next(e);
    }
  }
}

export const authMiddleware = new AuthMiddleware();
