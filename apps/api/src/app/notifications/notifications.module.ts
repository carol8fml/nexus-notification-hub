import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationFactory } from '../factories/notification.factory';
import { MailtrapProvider } from '../adapters/mailtrap.provider';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationFactory, MailtrapProvider],
})
export class NotificationsModule {}
