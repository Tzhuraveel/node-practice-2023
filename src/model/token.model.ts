import { model, Schema, Types } from "mongoose";

import { User } from "./user.model";

const tokenSchema = new Schema(
  {
    _user_id: {
      type: Types.ObjectId,
      ref: User,
      required: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

export const Token = model("token", tokenSchema);
