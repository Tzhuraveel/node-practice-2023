import { IUser } from "./user.type";

export type ITokenPayload = Pick<IUser, "_id" | "name">;

export interface ITokenPair {
  accessToken: string;
  refreshToken: string;
}
