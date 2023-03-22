import { CronJob } from "cron";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { ApiError } from "../error";
import { OldPassword } from "../model";

dayjs.extend(utc);

const oldPasswordRemover = async () => {
  try {
    const minuteAgo = dayjs().utc().subtract(1, "minute");

    await OldPassword.deleteMany({ createdAt: { $lte: minuteAgo } });
  } catch (e) {
    throw new ApiError(e.message, e.status);
  }
};

export const removeOldPasswords = new CronJob(
  "*/20 * * * * *",
  oldPasswordRemover
);
