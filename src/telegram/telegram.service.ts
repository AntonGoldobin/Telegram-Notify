import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Telegraf } from 'telegraf';

/**
 * Экранирует специальные символы для Telegram MarkdownV2.
 * См. https://core.telegram.org/bots/api#markdownv2-style
 */
function escapeMarkdownV2(text: string): string {
  return text
    .replace(/\_/g, '\\_')
    .replace(/\*/g, '\\*')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/\~/g, '\\~')
    .replace(/\`/g, '\\`')
    .replace(/\>/g, '\\>')
    .replace(/\#/g, '\\#')
    .replace(/\+/g, '\\+')
    .replace(/\-/g, '\\-')
    .replace(/\=/g, '\\=')
    .replace(/\|/g, '\\|')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/\./g, '\\.')
    .replace(/\!/g, '\\!');
}

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private bot: Telegraf;
  private mainChatId = '-1001190168845';

  constructor(private configService: ConfigService) {
    const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    if (!token) {
      this.logger.error(
        'TELEGRAM_BOT_TOKEN is not set in environment variables.',
      );
      throw new Error('TELEGRAM_BOT_TOKEN is required.');
    }
    this.bot = new Telegraf(token);
    this.logger.log('Telegram Bot initialized.');
  }

  /**
   * Отправляет сообщение в указанный канал/чат.
   * @param chatId Идентификатор канала или чата (например, @channelusername или chat_id).
   * @param message Текст сообщения.
   */
  async sendMessage(chatId: string | number, message: string): Promise<void> {
    try {
      this.logger.log(`Attempting to send message to chat ID: ${chatId}`);
      const escapedMessage = escapeMarkdownV2(message);
      await this.bot.telegram.sendMessage(chatId, escapedMessage, {
        parse_mode: 'MarkdownV2',
      });
      this.logger.log(`Message successfully sent to chat ID: ${chatId}`);
    } catch (error) {
      this.logger.error(`Failed to send message to chat ID: ${chatId}`, error);
      // В реальном приложении здесь можно добавить логику повторной попытки или уведомления
      throw new Error(`Failed to send message: ${error}`);
    }
  }

  async handleError(chatId: string | number, message: any) {
    try {
      const errorText = `Ошибка отправки, id чата - ${chatId}, сообщение - ${JSON.stringify(message)}`;
      const escapedMessage = escapeMarkdownV2(errorText);
      await this.bot.telegram.sendMessage(this.mainChatId, escapedMessage, {
        parse_mode: 'MarkdownV2',
      });
    } catch (err) {
      console.log(
        'Не удалось отправить сообщение, не удалось отправить ошибку в главный чат',
        err,
      );
    }
  }
}
