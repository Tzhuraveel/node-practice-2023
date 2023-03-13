import { IUser } from "./user.types";

export interface ITokenTypes {
  accessToken: string;
  refreshToken: string;
}

export type ITokenPayload = Pick<IUser, "_id" | "name">;
