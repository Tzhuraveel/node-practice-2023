import { config } from "dotenv";

config();

export const configs = {
  PORT: process.env.PORT,
  DB_URL: process.env.DB_URL,

  ACCESS_TOKEN: process.env.ACCESS,
  REFRESH_TOKEN: process.env.REFRESH,

  FORGOT_SECRET: process.env.FORGOT,
  ACTIVATE_SECRET: process.env.ACTION,

  EMAIL: process.env.EMAIL,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,

  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  TWILIO_SERVICE_SID: process.env.TWILIO_SERVICE_SID,

  FRONT_URL: process.env.FRONT_URL,
};
