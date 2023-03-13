import * as jwt from "jsonwebtoken";

import { configs } from "../config";
import { ETokenType } from "../enum";
import { ApiError } from "../error/api.error";
import { ITokenPayload, ITokenTypes } from "../types";

class TokenService {
  public generateTokenPair(payload: ITokenPayload): ITokenTypes {
    const accessToken = jwt.sign(payload, configs.ACCESS, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(payload, configs.REFRESH, {
      expiresIn: "30d",
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  public checkToken(
    token: string,
    tokenType = ETokenType.access
  ): ITokenPayload {
    try {
      let secret = "";
      switch (tokenType) {
        case ETokenType.access:
          secret = configs.ACCESS;
          break;
        case ETokenType.refresh:
          secret = configs.REFRESH;
          break;
      }

      return jwt.verify(token, secret) as ITokenPayload;
    } catch (e) {
      throw new ApiError("Token not valid", 401);
    }
  }
}

export const tokenService = new TokenService();
