import { EEmail, ESms } from "../enum";
import { ApiError } from "../error";
import { Token, User } from "../model";
import { ICredentials, IUser } from "../type";
import { ITokenPair, ITokenPayload } from "../type/token.type";
import { emailService } from "./email.service";
import { passwordService } from "./password.service";
import { smsService } from "./sms.service";
import { tokenService } from "./token.service";
import { userService } from "./user.service";

class AuthService {
  public async register(user: IUser): Promise<void> {
    try {
      const hashedPassword = await passwordService.hash(user.password);

      await userService.create({ ...user, password: hashedPassword });

      await Promise.all([
        emailService.sendMail(
          "zhuraveltimofiy2003@gmail.com",
          EEmail.FORGOT_PASSWORD
        ),

        smsService.sendSMS("+380632584573", ESms.WELCOME),
      ]);
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
  public async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ) {
    try {
      const user = await User.findById(userId);

      const isMatched = await passwordService.compare(
        oldPassword,
        user.password
      );

      if (!isMatched) {
        throw new ApiError("Wrong old password", 400);
      }

      const hashedPassword = await passwordService.hash(newPassword);

      await User.updateOne({ _id: user._id }, { password: hashedPassword });
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
}

export const authService = new AuthService();
