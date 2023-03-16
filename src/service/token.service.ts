import jwt from "jsonwebtoken";

import { configs } from "../config";
import { EActionTokenType, ETokenType } from "../enum";
import { ApiError } from "../error";
import { ITokenPair, ITokenPayload, IUser } from "../type";

class TokenService {
  public generateTokenPair(payload: ITokenPayload): ITokenPair {
    try {
      const accessToken = jwt.sign(payload, configs.ACCESS_TOKEN, {
        expiresIn: "15m",
      });
      const refreshToken = jwt.sign(payload, configs.REFRESH_TOKEN, {
        expiresIn: "30d",
      });

      return {
        accessToken,
        refreshToken,
      };
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public generateActionToken(
    payload: Pick<IUser, "_id">,
    tokenType: EActionTokenType
  ): string {
    try {
      let secret = "";
      switch (tokenType) {
        case EActionTokenType.action:
          secret = configs.ACTIVATE_SECRET;
          break;
        case EActionTokenType.forgot:
          secret = configs.FORGOT_SECRET;
          break;
      }
      return jwt.sign(payload, secret, { expiresIn: "7d" });
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public checkToken(token: string, tokenType: ETokenType) {
    try {
      let secret = "";
      switch (tokenType) {
        case ETokenType.accessToken:
          secret = configs.ACCESS_TOKEN;
          break;
        case ETokenType.refreshToken:
          secret = configs.REFRESH_TOKEN;
          break;
        case ETokenType.forgotToken:
          secret = configs.FORGOT_SECRET;
          break;
        case ETokenType.actionToken:
          secret = configs.ACTIVATE_SECRET;
          break;
      }

      return jwt.verify(token, secret);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
}

export const tokenService = new TokenService();
