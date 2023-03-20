import { ApiError } from "../error";
import { User } from "../model";
import { IUser } from "../type";

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
  public async getBySpecifiedField(
    dbField: string,
    field: string
  ): Promise<IUser> {
    try {
      return await User.findOne({ [dbField]: field });
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
}

export const userService = new UserService();
