import { validate } from 'class-validator';
import { SendNotificationDto } from './send-notification.dto';

describe('SendNotificationDto', () => {
  it('should pass validation with valid data', async () => {
    const dto = new SendNotificationDto();
    dto.type = 'email';
    dto.destination = 'test@example.com';
    dto.content = 'Test message';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation when type is missing', async () => {
    const dto = new SendNotificationDto();
    dto.destination = 'test@example.com';
    dto.content = 'Test message';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.property === 'type')).toBe(true);
  });

  it('should fail validation when destination is missing', async () => {
    const dto = new SendNotificationDto();
    dto.type = 'email';
    dto.content = 'Test message';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.property === 'destination')).toBe(true);
  });

  it('should fail validation when destination is empty string', async () => {
    const dto = new SendNotificationDto();
    dto.type = 'email';
    dto.destination = '';
    dto.content = 'Test message';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.property === 'destination')).toBe(true);
  });

  it('should fail validation when content is missing', async () => {
    const dto = new SendNotificationDto();
    dto.type = 'email';
    dto.destination = 'test@example.com';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.property === 'content')).toBe(true);
  });

  it('should fail validation when content is empty string', async () => {
    const dto = new SendNotificationDto();
    dto.type = 'email';
    dto.destination = 'test@example.com';
    dto.content = '';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.property === 'content')).toBe(true);
  });
});
