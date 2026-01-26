import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { MailtrapProvider } from './mailtrap.provider';

jest.mock('nodemailer');

describe('MailtrapProvider', () => {
  let provider: MailtrapProvider;
  let configService: ConfigService;
  let mockTransporter: {
    sendMail: jest.Mock;
  };

  beforeEach(async () => {
    mockTransporter = {
      sendMail: jest.fn().mockResolvedValue({ messageId: 'test-id' }),
    };

    (nodemailer.createTransport as jest.Mock).mockReturnValue(mockTransporter);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailtrapProvider,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const config: Record<string, string | number> = {
                MAILTRAP_HOST: 'smtp.mailtrap.io',
                MAILTRAP_PORT: 2525,
                MAILTRAP_USER: 'test-user',
                MAILTRAP_PASS: 'test-pass',
              };
              return config[key];
            }),
          },
        },
      ],
    }).compile();

    provider = module.get<MailtrapProvider>(MailtrapProvider);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  it('should create transporter with correct config', () => {
    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: 'test-user',
        pass: 'test-pass',
      },
    });
  });

  it('should send email with correct parameters', async () => {
    const to = 'recipient@example.com';
    const content = 'Test email content';

    await provider.send(to, content);

    expect(mockTransporter.sendMail).toHaveBeenCalledWith({
      from: 'noreply@nexus.com',
      to,
      subject: 'Notification from Nexus',
      text: content,
      html: `<p>${content}</p>`,
    });
  });

  it('should handle sendMail errors', async () => {
    const error = new Error('SMTP error');
    mockTransporter.sendMail.mockRejectedValueOnce(error);

    await expect(
      provider.send('test@example.com', 'content')
    ).rejects.toThrow('SMTP error');
  });
});
