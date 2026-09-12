import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    // Allow local React frontend origin for browser requests + preflight checks.
    origin: ['http://localhost:5173'],
    credentials: true,
    // Include OPTIONS so browser CORS preflight requests are accepted.
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    // Explicitly allow auth and JSON headers used by frontend API calls.
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  const config = new DocumentBuilder()
    .setTitle('Job Portal API')
    .setDescription('API documentation for job portal with subscription system')
    .setVersion('1.0')
    .addBearerAuth() //
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // 👉 http://localhost:3000/api

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
  console.log(`API listening on http://localhost:${port}`);
}
bootstrap();
