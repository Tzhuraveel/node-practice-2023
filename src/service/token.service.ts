import * as jwn from "jsonwebtoken";

import { ITokenPair, ITokenPayload } from "../types/token.types";

class TokenService {
  public generateTokenPair(payload: ITokenPayload): ITokenPair {
    const accessToken = jwn.sign(payload, "JWT_ACCESS_TOKEN", {
      expiresIn: "15m",
    });
    const refreshToken = jwn.sign(payload, "JWT_REFRESH_TOKEN", {
      expiresIn: "30d",
    });

    return { accessToken, refreshToken };
  }
}

export const tokenService = new TokenService();
