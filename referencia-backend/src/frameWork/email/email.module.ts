import { Module } from "@nestjs/common";
import { EmailEntity } from "./entity/email.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EmailService } from "./email.service";
import { TransactionService } from "../transaction/transaction.service";
import { MailerModule } from "@nestjs-modules/mailer";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
    imports: [
        ConfigModule,
        TypeOrmModule.forFeature([EmailEntity]),
        MailerModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                transport: {
                    host: configService.get('MAIL_HOST'),
                    port: Number(configService.get('MAIL_PORT')),
                    secure: configService.get('MAIL_SECURE') === 'true',
                    auth: {
                        user: configService.get('MAIL_USER'),
                        pass: configService.get('MAIL_PASS'),
                    },
                    tls: {
                        rejectUnauthorized: false,
                    },
                },
                defaults: {
                    from: `"${configService.get('MAIL_FROM_NAME', 'Meu Sistema')}" <${configService.get('MAIL_FROM_ADDRESS', 'noreply@seudominio.com')}>`,
                },
            }),
        }),
    ],
    providers: [EmailService, TransactionService],
    exports: [EmailService],
})
export class EmailModule {};