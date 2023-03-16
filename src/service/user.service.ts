import { ApiError } from "../error";
import { User } from "../model";
import { IUser } from "../type";
import { passwordService } from "./password.service";

class UserService {
  public async getAll(): Promise<IUser[]> {
    try {
      return await User.find();
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
  public async create(user: IUser): Promise<void> {
    try {
      await User.create(user);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
  public async getById(userId: string): Promise<IUser> {
    try {
      return await User.findById(userId);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
  public async delete(userId: string): Promise<void> {
    try {
      await User.deleteOne({ _id: userId });
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
      const user = await this.getById(userId);

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

export const userService = new UserService();
