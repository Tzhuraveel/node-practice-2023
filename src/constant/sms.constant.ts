import { EEmail } from "../enum";

export const smsTemplates: {
  [key: string]: string;
} = {
  [EEmail.WELCOME]:
    "Дякуємо вам за покупку в нашому магазині! Посилка буде" +
    " відправлена через декілька днів. Наш сайт: https://www.instagram.com/tzhuraveel/ ",
  [EEmail.FORGOT_PASSWORD]:
    "Ohh, you have forgotten your password. It's awful. I feel sorry for you...However, i can help you! ",
};
