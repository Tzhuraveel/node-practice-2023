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
  public async create(user: IUser) {
    try {
      return await User.create(user);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
  public async delete(userId: string) {
    try {
      return await User.deleteOne({ _id: userId });
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
  public async update(userId: string, user: IUser) {
    try {
      return await User.updateOne({ _id: userId }, user);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
  public async findByField(dbField: string, field: string): Promise<IUser> {
    try {
      return await User.findOne({ [dbField]: field });
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
}

export const userService = new UserService();
