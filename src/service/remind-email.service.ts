import { EEmailAction } from "../enum";
import { ApiError } from "../error";
import { emailService } from "./email.service";
import { userService } from "./user.service";

class RemindEmailService {
  public async reminder(userId: any): Promise<void> {
    try {
      const user = await userService.getById(userId);

      await emailService.sendMail(user, EEmailAction.WELCOME);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
}

export const reminderService = new RemindEmailService();
