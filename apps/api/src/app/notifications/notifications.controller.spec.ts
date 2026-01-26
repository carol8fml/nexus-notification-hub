import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from './notifications.controller';
import { NotificationFactory } from '../factories/notification.factory';
import { SendNotificationDto } from '@nexus/shared-dtos';
import { NotificationProvider } from '../interfaces/notification-provider.interface';

describe('NotificationsController', () => {
  let controller: NotificationsController;
  let notificationFactory: NotificationFactory;
  let mockProvider: NotificationProvider;

  beforeEach(async () => {
    mockProvider = {
      send: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [
        {
          provide: NotificationFactory,
          useValue: {
            getProvider: jest.fn().mockReturnValue(mockProvider),
          },
        },
      ],
    }).compile();

    controller = module.get<NotificationsController>(NotificationsController);
    notificationFactory = module.get<NotificationFactory>(NotificationFactory);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should send notification successfully', async () => {
    const dto: SendNotificationDto = {
      type: 'email',
      destination: 'test@example.com',
      content: 'Test message',
    };

    const result = await controller.sendNotification(dto);

    expect(notificationFactory.getProvider).toHaveBeenCalledWith('email');
    expect(mockProvider.send).toHaveBeenCalledWith(
      'test@example.com',
      'Test message'
    );
    expect(result).toEqual({
      success: true,
      message: 'Notification sent via email',
    });
  });

  it('should handle provider errors', async () => {
    const error = new Error('Provider error');
    mockProvider.send = jest.fn().mockRejectedValue(error);

    const dto: SendNotificationDto = {
      type: 'email',
      destination: 'test@example.com',
      content: 'Test message',
    };

    await expect(controller.sendNotification(dto)).rejects.toThrow(
      'Provider error'
    );
  });
});
