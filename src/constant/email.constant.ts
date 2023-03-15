import { EEmail } from "../enum";

export const allTemplates: {
  [key: string]: { templateName: string; subject: string };
} = {
  [EEmail.WELCOME]: {
    templateName: "register",
    subject: "Today very comfortable weather",
  },
  [EEmail.FORGOT_PASSWORD]: {
    templateName: "forgot_password",
    subject:
      "Ohh, you have forgotten your password. It's awful. I feel sorry for you...However, i can help you! ",
  },
};
