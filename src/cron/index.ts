import { reminderAboutLogin } from "./reminder.cron";
import { removeOldPasswords } from "./remove.old.password.cron";
import { removeToken } from "./remove.old.token.cron";

export const cronRunner = () => {
  removeToken.start();
  removeOldPasswords.start();
  reminderAboutLogin.start();
};
