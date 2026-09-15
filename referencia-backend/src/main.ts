import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './frameWork/exceptions/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Configuração de CORS (DEVE vir antes de outros middlewares)
  app.enableCors({
    origin: (origin, callback) => {
      // Permite requisições sem origin (como mobile apps, Postman ou cURL)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        'http://192.168.10.9:3000',
        'http://localhost:3000',
      ];

      const isCloudflare = /\.trycloudflare\.com$/.test(origin);
      const isAllowed = allowedOrigins.includes(origin) || isCloudflare;

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error('Origem não permitida pelo CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  // 2. Filtros globais
  app.useGlobalFilters(new AllExceptionsFilter());

  // 3. Middlewares de log (opcionais, agora executados com os headers de CORS já tratados)
  app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url} - Origin: ${req.headers.origin}`);
    next();
  });

  await app.listen(3010, '0.0.0.0');
}
bootstrap();