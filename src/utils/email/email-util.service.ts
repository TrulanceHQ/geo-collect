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
    tls: {
      rejectUnauthorized: false, // Allow insecure connections
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
        <p>Please log in and change your password immediately.</p>
        <br>
        <p>Best Regards,</p>
        <p>Geotrak</p>
      `;
    } else if (template === 'reset-password') {
      htmlTemplate = `
        <h3>Password Reset Request</h3>
        <p>Click the link below to reset your password. This link is valid for only 5 minutes:</p>
        <p><a href="${context.resetLink}" style="color: blue; text-decoration: underline;">
          Reset Your Password
        </a></p>
        <p>If you did not request a password reset, please ignore this email.</p>
        <br>
        <p>Best Regards,</p>
        <p>Geotrak</p>
      `;
    } else if (template === 'demo-request-confirmation') {
      const geotrakPhone = '+234 913 246 2410';
      const geotrakEmail = 'support@8thgearpartners.com';
      const geotrakSupportText = 'Geotrak Support';

      htmlTemplate = `
        <p>Hello ${context.fullName},</p>
        <p>Thanks for requesting a demo!</p>
        <p>We’ll be in touch shortly to schedule your session.</p>
        <p>
          If you need immediate assistance, feel free to call us at
          <strong>${geotrakPhone}</strong> or email
          <a
            href="mailto:${geotrakEmail}"
            style="text-decoration: none; color: black;"
          >
            <strong>${geotrakSupportText}</strong>
          </a>.
        </p>
        <p>Best Regards</p>
        <p>Geotrak</p>    
      `;
    }

    try {
      const info = await this.transporter.sendMail({
        from: `"GeoTrak" <${process.env.BREVO_FROM}>`,
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

  async sendResetPasswordEmail(
    to: string,
    subject: string,
    template: string,
    context: any,
  ) {
    return this.sendEmail(to, subject, template, context);
  }
}
