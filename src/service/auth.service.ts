import { ApiError } from "../error/api.error";
import { Token } from "../model";
import { ICredentials, ITokenPayload, ITokenTypes, IUser } from "../types";
import { passwordService } from "./password.service";
import { tokenService } from "./token.service";
import { userService } from "./user.service";

class AuthService {
  public async register(user: IUser): Promise<void> {
    try {
      const hashedPassword = await passwordService.hash(user.password);

      await userService.create({ ...user, password: hashedPassword });
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
  public async login(
    credentials: ICredentials,
    user: IUser
  ): Promise<ITokenTypes> {
    try {
      const { password } = credentials;

      const isMatched = await passwordService.compare(password, user.password);

      if (!isMatched) {
        throw new ApiError("Wrong password or email", 404);
      }

      const tokenPair = tokenService.generateTokenPair({
        _id: user._id,
        name: user.name,
      });

      await Token.create({
        _user_id: user._id,
        ...tokenPair,
      });
      console.log("hello");

      return tokenPair;
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
  public async refresh(
    tokenInfo: ITokenTypes,
    jwtPayload: ITokenPayload
  ): Promise<ITokenTypes> {
    try {
      const tokenPair = tokenService.generateTokenPair({
        _id: jwtPayload._id,
        name: jwtPayload.name,
      });

      await Promise.all([
        Token.create({ _user_id: jwtPayload._id, ...tokenPair }),
        Token.deleteOne({ refreshToken: tokenInfo.refreshToken }),
      ]);
      console.log("hello");

      return tokenPair;
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
}

export const authService = new AuthService();
