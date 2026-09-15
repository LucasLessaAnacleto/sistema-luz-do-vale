import { InjectRepository } from "@nestjs/typeorm";
import { EMAIL_STATUS, EmailEntity } from "./entity/email.entity";
import { Repository } from "typeorm";
import { TransactionService } from "../transaction/transaction.service";
import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class EmailService {
    private readonly logger = new Logger(EmailService.name);
    
    constructor(
        @InjectRepository(EmailEntity)
        private readonly emailRepository: Repository<EmailEntity>,
        private readonly transactionService: TransactionService,
        private readonly mailerService: MailerService,
    ) { }

    async create<EmailEntity>(email: EmailEntity) {
        const queryRunner = await this.transactionService.beginTransaction();

        try {

            const savedEmail = await queryRunner.manager.save(EmailEntity, email);

            await queryRunner.commitTransaction();

            return savedEmail;

        } catch (error) {
            console.trace(error);
            await queryRunner.rollbackTransaction();
            throw error;
        }
    }

    async findAllPendingEmails() {
        return this.emailRepository.find({ where: { status: EMAIL_STATUS.PENDENTE } });
    }

    async updateEmailStatus(id: number, status: EMAIL_STATUS) {

        const email = await this.emailRepository.findOne({ where: { id } });
        if (!email) {
            throw new BadRequestException('Email não encontrado');
        }

        const queryRunner = await this.transactionService.beginTransaction();

        try {
            email.status = status;

            await queryRunner.manager.save(email);

            await queryRunner.commitTransaction();

            return email;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
    }

    async enviarEmailsPendentes() {
        const emailsPendentes = await this.findAllPendingEmails();

        for (const email of emailsPendentes) {
            try {
                this.logger.log(`Enviando e-mail pendente para ${email.destinatario}`);
                
                await this.sendEmailAsync(email);
                
                await this.updateEmailStatus(email.id, EMAIL_STATUS.ENVIADO);
            } catch (error) {
                await this.updateEmailStatus(email.id, EMAIL_STATUS.ERRO);
                throw error;
            }
        }
    }

    private async sendEmailAsync(email: EmailEntity): Promise<boolean> {
        try {

            await this.mailerService.sendMail({
                to: email.destinatario,
                subject: email.assunto,
                html: email.corpo,
                attachments: [{
                    filename: email.nomeAnexo || 'anexo.txt',
                    content: Buffer.from(email.anexo.replace(/^data:.+;base64,/, ''), 'base64'),
                }]
            });

            this.logger.log(`E-mail com anexo enviado com sucesso para ${email.destinatario}`);
            return true;
        } catch (error) {
            this.logger.error(`Falha ao enviar e-mail ${email.id}: ${error.message}`);
            throw error;
        }
    }

}