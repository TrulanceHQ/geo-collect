import { MailerService, ISendMailOptions } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailUtil {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(
    to: string,
    subject: string,
    template: string,
    context: Record<string, any>,
  ): Promise<void> {
    await this.mailerService.sendMail(<ISendMailOptions>{
      to,
      subject,
      template, // e.g., './verification-code'
      context, // e.g., { code: '123456' }
    });
  }
}
