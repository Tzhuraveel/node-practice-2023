export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  gender: string;
}

export interface IUserFromMongo {
  _id?: string;
  name: string;
  email: string;
  password: string;
  gender: string;
  status: string;
  createdAt?: NativeDate;
  updatedAt?: NativeDate;
}
