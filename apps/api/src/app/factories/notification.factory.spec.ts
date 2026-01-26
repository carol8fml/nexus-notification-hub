import { Test, TestingModule } from '@nestjs/testing';
import { NotificationFactory } from './notification.factory';
import { MailtrapProvider } from '../adapters/mailtrap.provider';

describe('NotificationFactory', () => {
  let factory: NotificationFactory;
  let mailtrapProvider: MailtrapProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationFactory,
        {
          provide: MailtrapProvider,
          useValue: {
            send: jest.fn(),
          },
        },
      ],
    }).compile();

    factory = module.get<NotificationFactory>(NotificationFactory);
    mailtrapProvider = module.get<MailtrapProvider>(MailtrapProvider);
  });

  it('should be defined', () => {
    expect(factory).toBeDefined();
  });

  it('should return MailtrapProvider for email type', () => {
    const provider = factory.getProvider('email');
    expect(provider).toBe(mailtrapProvider);
    expect(provider).toBeInstanceOf(Object);
  });

  it('should throw error for unsupported type', () => {
    expect(() => {
      factory.getProvider('invalid' as 'email');
    }).toThrow('Unsupported notification type: invalid');
  });

  it('should return provider that implements NotificationProvider interface', () => {
    const provider = factory.getProvider('email');
    expect(provider).toHaveProperty('send');
    expect(typeof provider.send).toBe('function');
  });
});
