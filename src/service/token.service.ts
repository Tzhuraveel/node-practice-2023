import * as jwt from "jsonwebtoken";

import { configs } from "../config";
import { ETokenType } from "../enum";
import { ApiError } from "../error";
import { ITokenPair, ITokenPayload } from "../type/token.type";

class TokenService {
  public generateTokenPair(payload: ITokenPayload): ITokenPair {
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
  }
  public checkToken(token: string, tokenType: ETokenType): ITokenPayload {
    try {
      let secret = "";
      switch (tokenType) {
        case ETokenType.access:
          secret = configs.ACCESS_TOKEN;
          break;
        case ETokenType.refresh:
          secret = configs.REFRESH_TOKEN;
          break;
      }
      return jwt.verify(token, secret) as ITokenPayload;
    } catch (e) {
      throw new ApiError("Token not valid", 401);
    }
  }
}

export const tokenService = new TokenService();
