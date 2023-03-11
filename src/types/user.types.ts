export enum EGenders {
  male = "male",
  female = "female",
}

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  gender: string;
}

export interface ICommonResponse<T> {
  message: string;
  data: T;
}

export interface IDeleteResponse {
  message: string;
}
