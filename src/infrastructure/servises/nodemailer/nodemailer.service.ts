import nodemailer from 'nodemailer';
import { appSettings } from '@settings/app-settings';
import { SentMessageInfo } from 'nodemailer/lib/smtp-transport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NodeMailer {
  private transporter: nodemailer.Transporter<SentMessageInfo>;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: appSettings.api.EMAIL_USER,
        pass: appSettings.api.EMAIL_PASS,
      },
    });
  }

  async sendMail(
    to: string,
    subject: string,
    text: string,
    html: string,
  ): Promise<void> {
    const mailOptions = {
      from: `"Nikita" <${appSettings.api.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    };

    return new Promise((resolve, reject) => {
      this.transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return reject(error);
        } else {
          console.log('Message sent: %s', info.messageId);
          console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

          resolve();
        }
      });
    });
  }
}
