import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const DEFAULT_ORIGINS = [
  'https://jennifershih.github.io',
  'http://localhost:4200',
];

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(',') ?? DEFAULT_ORIGINS,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
