import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SendMessageDto } from './dto/send-message.dto';
import { TelegramService } from './telegram.service';

@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Post('send-notification')
  @HttpCode(HttpStatus.OK)
  async sendNotification(@Body() sendMessageDto: SendMessageDto) {
    const { channelId, message } = sendMessageDto;
    await this.telegramService.sendMessage(channelId, message);
    return {
      statusCode: HttpStatus.OK,
      message: 'Notification sent successfully',
    };
  }
}
