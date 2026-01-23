import { Controller, Post, Body } from '@nestjs/common';
import { SendNotificationDto } from '@nexus/shared-dtos';
import { NotificationFactory } from '../factories/notification.factory';

@Controller('api/notifications')
export class NotificationsController {
  constructor(private notificationFactory: NotificationFactory) {}

  @Post()
  async sendNotification(@Body() dto: SendNotificationDto) {
    const provider = this.notificationFactory.getProvider(dto.type);
    await provider.send(dto.destination, dto.content);
    return {
      success: true,
      message: `Notification sent via ${dto.type}`,
    };
  }
}
