import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log('Server is running on port:', process.env.PORT!);
  await app.listen(process.env.PORT!);
}

bootstrap();
