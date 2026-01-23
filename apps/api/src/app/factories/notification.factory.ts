import { Injectable } from '@nestjs/common';
import { MailtrapProvider } from '../adapters/mailtrap.provider';
import { NotificationProvider } from '../interfaces/notification-provider.interface';

@Injectable()
export class NotificationFactory {
  constructor(private mailtrapProvider: MailtrapProvider) {}

  getProvider(type: 'email'): NotificationProvider {
    switch (type) {
      case 'email':
        return this.mailtrapProvider;
      default:
        throw new Error(`Unsupported notification type: ${type}`);
    }
  }
}
