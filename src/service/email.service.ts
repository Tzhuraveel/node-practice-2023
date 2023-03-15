import * as path from "node:path";

import EmailTemplates from "email-templates";
import nodemailer, { Transporter } from "nodemailer";

import { configs } from "../config";
import { allTemplates } from "../constant";
import { EEmail } from "../enum";

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

  public async sendMail(email: string, emailAction: EEmail) {
    const chosenTemplate = allTemplates[emailAction];
    const html = await this.templateParser.render(chosenTemplate.templateName);
    return this.transporter.sendMail({
      from: "No reply",
      to: email,
      subject: chosenTemplate.subject,
      html: html,
    });
  }
}

export const emailService = new EmailService();
