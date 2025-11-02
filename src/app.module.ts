import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegramModule } from './telegram/telegram.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Делаем ConfigModule глобальным
      envFilePath: '.env', // Указываем путь к .env файлу
    }),
    TelegramModule, // Импортируем наш модуль для работы с Telegram
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
