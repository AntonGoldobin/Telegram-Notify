import { IsString, IsNotEmpty } from 'class-validator';

export class SendMessageDto {
  @IsString()
  @IsNotEmpty()
  channelId: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}
