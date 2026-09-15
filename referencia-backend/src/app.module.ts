import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LancamentosModule } from './useCases/lancamentos/lancamentos.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './useCases/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuditModule } from './useCases/audit/audit.module';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { JobsModule } from './frameWork/scheduler/job.module';
import { EmailModule } from './frameWork/email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Deixa disponível em toda a aplicação
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const dbHost = configService.get<string>('DB_HOST');

        return {
          type: 'postgres',
          host: dbHost,
          port: Number(configService.get<string>('DB_PORT') || '5432'),
          username: configService.get('DB_USERNAME'),
          database: configService.get('DB'),
          password: configService.get('DB_PASSWORD'),
          autoLoadEntities: true, // Carrega entidades sem precisar especifica-las
          synchronize: configService.get('DB_SYNCHRONIZE'), // Sincroniza com o BD. Não deve ser usado em produção
          logging: true,
          namingStrategy: new SnakeNamingStrategy(),
          ssl: {
            rejectUnauthorized: false,
          },
          extra: {
            ssl: {
              rejectUnauthorized: false,
              servername: dbHost, // Resolve o roteamento SSL/SNI do Supabase
            },
          },
        };
      },
      inject: [ConfigService],
    }),
    LancamentosModule,
    AuthModule,
    AuditModule,
    JobsModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
