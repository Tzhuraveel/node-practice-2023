import { ESmsAction } from "../enum";

export const smsTemplates: { [key: string]: string } = {
  [ESmsAction.CHANGE_PASSWORD]: "Ваш пароль був успішно змінений",
};
