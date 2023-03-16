import { EEmailAction } from "../enum";

export const allTemplates: {
  [key: string]: { templateName: string; subject: string };
} = {
  [EEmailAction.WELCOME]: {
    templateName: "welcome",
    subject: "We are very happy, that you with us now",
  },
  [EEmailAction.FORGOT_PASSWORD]: {
    templateName: "forgotPassword",
    subject:
      "Not worry! You will be able to create new Password. So you will be able",
  },
};
