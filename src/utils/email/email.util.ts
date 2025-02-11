import { MailerService, ISendMailOptions } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailUtil {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(
    to: string,
    subject: string,
    template: string,
    context: {
      password: string;
      role: string;
    },
  ): Promise<void> {
    await this.mailerService.sendMail(<ISendMailOptions>(<unknown>{
      to,
      subject,
      template,
      context: {
        password: context.password,
        role: context.role,
      },
    }));
  }

  async sendResetPasswordEmail(
    to: string,
    subject: string,
    template: string,
    context: {
      resetLink: string;
    },
  ): Promise<void> {
    await this.mailerService.sendMail(<ISendMailOptions>(<unknown>{
      to,
      subject,
      template,
      context: {
        resetLink: context.resetLink,
      },
    }));
  }
}
