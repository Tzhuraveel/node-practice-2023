import { ApiError } from "../error";
import { Token } from "../model";
import { ICredentials, IUser } from "../type";
import { ITokenPair, ITokenPayload } from "../type/token.type";
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
    credential: ICredentials,
    user: IUser
  ): Promise<ITokenPair> {
    try {
      console.log(credential.password, user.password);
      const isMatched = await passwordService.compare(
        user.password,
        credential.password
      );

      if (isMatched) {
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

      return tokenPair;
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
  public async refresh(
    jwtPayload: ITokenPayload,
    oldToken: ITokenPair
  ): Promise<ITokenPair> {
    try {
      const tokenPair = tokenService.generateTokenPair({
        _id: jwtPayload._id,
        name: jwtPayload.name,
      });

      await Promise.all([
        Token.create({ _user_id: jwtPayload._id, ...tokenPair }),
        Token.deleteOne({ refreshToken: oldToken.refreshToken }),
      ]);

      return tokenPair;
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
}

export const authService = new AuthService();
