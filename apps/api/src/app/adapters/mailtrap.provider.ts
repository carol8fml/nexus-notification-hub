import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { NotificationProvider } from '../interfaces/notification-provider.interface';

@Injectable()
export class MailtrapProvider implements NotificationProvider {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAILTRAP_HOST'),
      port: this.configService.get<number>('MAILTRAP_PORT'),
      auth: {
        user: this.configService.get<string>('MAILTRAP_USER'),
        pass: this.configService.get<string>('MAILTRAP_PASS'),
      },
    });
  }

  async send(to: string, content: string): Promise<void> {
    await this.transporter.sendMail({
      from: 'noreply@nexus.com',
      to,
      subject: 'Notification from Nexus',
      text: content,
      html: `<p>${content}</p>`,
    });
  }
}
