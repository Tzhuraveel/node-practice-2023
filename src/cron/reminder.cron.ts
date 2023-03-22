import { CronJob } from "cron";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { ApiError } from "../error";
import { Token } from "../model";
import { reminderService } from "../service";

dayjs.extend(utc);

const reminder = async () => {
  try {
    const minuteAgo = dayjs().utc().subtract(1, "minute");

    const users = await Token.find({ createdAt: { $lte: minuteAgo } }).lean();

    if (users.length) {
      await Promise.all([
        users.map(async (token) => {
          await reminderService.reminder(token._user_id);
        }),
      ]);
    }
  } catch (e) {
    throw new ApiError(e.message, e.status);
  }
};

export const reminderAboutLogin = new CronJob("*/15 * * * * *", reminder);
