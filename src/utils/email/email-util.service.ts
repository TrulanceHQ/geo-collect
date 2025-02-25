/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class EmailUtil {
  private transporter = nodemailer.createTransport({
    host: process.env.BREVO_HOST,
    port: Number(process.env.BREVO_PORT),
    secure: false, // Use `true` for port 465
    auth: {
      user: process.env.BREVO_USER,
      pass: process.env.BREVO_PASS,
    },
  });

  async sendEmail(to: string, subject: string, template: string, context: any) {
    let htmlTemplate = '';

    if (template === 'temporary-password') {
      htmlTemplate = `
        <h3>Welcome!</h3>
        <p>Your account has been created. Here are your details:</p>
        <p><strong>Temporary Password:</strong> ${context.password}</p>
        <p><strong>Role:</strong> ${context.role}</p>
        <p>Please log in and update your details immediately.</p>
        <br>
        <p>Best Regards,</p>
        <p>Your Company Team</p>
      `;
    }

    try {
      const info = await this.transporter.sendMail({
        from: `"Your App" <${process.env.BREVO_FROM}>`,
        to,
        subject,
        html: htmlTemplate,
      });

      console.log('Email sent:', info.messageId);
      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Email could not be sent');
    }
  }
}
