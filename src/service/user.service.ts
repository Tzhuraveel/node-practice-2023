import { ApiError } from "../error/api.error";
import { User } from "../model/user.model";
import { IUser } from "../types/user.types";

class UserService {
  public async getAll() {
    try {
      return User.find();
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
  public async getById(userId: string) {
    try {
      return User.findById(userId);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
  public async create(user: IUser) {
    try {
      return User.create(user);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
  public async update(userId: string, user: IUser) {
    try {
      console.log(user);
      return User.findByIdAndUpdate(userId, { ...user }, { new: true });
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
  public async delete(userId: string): Promise<void> {
    try {
      console.log("delete");
      await User.deleteOne({ _id: userId });
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
}

export const userService = new UserService();
