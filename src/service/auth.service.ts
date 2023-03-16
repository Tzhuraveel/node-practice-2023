import { EActionTokenType, EEmailAction } from "../enum";
import { ApiError } from "../error";
import { Action, Token, User } from "../model";
import { ITokenPair, ITokenPayload, IUser } from "../type";
import { emailService } from "./email.service";
import { passwordService } from "./password.service";
import { tokenService } from "./token.service";

class AuthService {
  public async login(user: IUser, password: string): Promise<ITokenPair> {
    try {
      const isMatched = await passwordService.compare(password, user.password);

      if (!isMatched) throw new ApiError("Wrong password or email", 400);

      const tokenPair = tokenService.generateTokenPair({
        _id: user._id,
        name: user.name,
      });

      await Token.create({
        _user_id: user._id,
        accessToken: tokenPair.accessToken,
        refreshToken: tokenPair.refreshToken,
      });

      return tokenPair;
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
  public async refresh(
    jwtPayload: ITokenPayload,
    tokenInfo: ITokenPair
  ): Promise<ITokenPair> {
    const tokenPair = tokenService.generateTokenPair({
      _id: jwtPayload._id,
      name: jwtPayload.name,
    });

    await Promise.all([
      Token.create({ _user_id: jwtPayload._id, ...tokenPair }),
      Token.deleteOne({ refreshToken: tokenInfo.refreshToken }),
    ]);

    return tokenPair;
  }
  public async forgotPassword(user: IUser) {
    try {
      const actionToken = tokenService.generateActionToken(
        { _id: user._id },
        EActionTokenType.forgot
      );

      await Action.create({
        actionToken,
        tokenType: EActionTokenType.forgot,
        _user_id: user._id,
      });

      await emailService.sendMail(user, EEmailAction.FORGOT_PASSWORD, {
        actionToken,
      });
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
  public async updateForgotPassword(
    password: string,
    userId: string,
    actionToken: string
  ): Promise<void> {
    try {
      const hashedPassword = await passwordService.hash(password);

      await User.updateOne({ _id: userId }, { password: hashedPassword });
      await Action.deleteOne({ actionToken });
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
}

export const authService = new AuthService();
