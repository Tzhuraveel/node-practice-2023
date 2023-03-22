import { CronJob } from "cron";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { ApiError } from "../error";
import { Token } from "../model";

dayjs.extend(utc);

const tokensRemover = async () => {
  try {
    const temMinuteAgo = dayjs().utc().subtract(10, "minute");

    await Token.deleteMany({ createdAt: { $lte: temMinuteAgo } });
  } catch (e) {
    throw new ApiError(e.message, e.status);
  }
};

export const removeToken = new CronJob("*/3 * * * * *", tokensRemover);
