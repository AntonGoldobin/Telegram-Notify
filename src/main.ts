import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Глобальный ValidationPipe для валидации всех входящих данных
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Отбрасывать свойства, которых нет в DTO
    forbidNonWhitelisted: true, // Запрещать запросы с лишними свойствами
    transform: true, // Автоматически преобразовывать типы
  }));

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
