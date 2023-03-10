export enum EGenders {
  male = "male",
  female = "female",
}

export interface IUser {
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
