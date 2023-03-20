import { config } from "dotenv";

config();

export const configs = {
  PORT: process.env.PORT,
  DB_URL: process.env.DB_URL,

  EMAIL: process.env.EMAIL,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,

  ACCESS_SECRET: process.env.ACCESS,
  REFRESH_SECRET: process.env.REFRESH,

  FRONT_URL: process.env.FRONT_URL,

  FORGOT_SECRET: process.env.FORGOT,
  ACTIVATE_SECRET: process.env.ACTIVATE,
};
