import * as path from "node:path";

import EmailTemplates from "email-templates";
import nodemailer, { Transporter } from "nodemailer";

import { configs } from "../config";
import { allTemplates } from "../constant";
import { EEmailAction } from "../enum";
import { IUser } from "../type";

class EmailService {
  private transporter: Transporter;
  private templateParser;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: configs.EMAIL,
        pass: configs.EMAIL_PASSWORD,
      },
    });
    this.templateParser = new EmailTemplates({
      views: {
        root: path.join(process.cwd(), "src", "static"),
        options: {
          extension: "hbs",
        },
      },
      juice: true,
      juiceResources: {
        webResources: {
          relativeTo: path.join(process.cwd(), "src", "static", "css"),
        },
      },
    });
  }

  public async sendMail(
    user: IUser,
    emailAction: EEmailAction,
    locals: Record<string, string>
  ) {
    const chosenTemplate = allTemplates[emailAction];
    const html = await this.templateParser.render(chosenTemplate.templateName, {
      token: locals.actionToken,
      name: user.name,
      frontUrl: configs.FRONT_URL,
    });

    return this.transporter.sendMail({
      from: "No reply",
      to: user.email,
      subject: chosenTemplate.subject,
      html,
    });
  }
}

export const emailService = new EmailService();
