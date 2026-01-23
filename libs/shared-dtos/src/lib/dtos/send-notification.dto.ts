import { IsEnum, IsString, IsNotEmpty } from 'class-validator';

export class SendNotificationDto {
  @IsEnum(['email'])
  @IsNotEmpty()
  type!: 'email';

  @IsString()
  @IsNotEmpty()
  destination!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;
}
