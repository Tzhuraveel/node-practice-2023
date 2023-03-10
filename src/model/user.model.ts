import { model, Schema } from "mongoose";

import { EGenders } from "../types/user.types";

const userScheme = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    gender: {
      type: String,
      enum: EGenders,
    },
  },
  { versionKey: false }
);

export const User = model("user", userScheme);
