import { InjectRepository } from "@nestjs/typeorm";
import { CronJobEntity } from "./entity/cron.entity";
import { Repository } from "typeorm";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { SchedulerService } from "./scheduler.service";
import { TransactionService } from "../transaction/transaction.service";
import { LancamentosService } from "src/useCases/lancamentos/lancamentos.service";

@Injectable()
export class JobsService {
    constructor(
        @InjectRepository(CronJobEntity)
        private readonly cronJobRepository: Repository<CronJobEntity>,
        private readonly schedulerService: SchedulerService,
        private readonly transactionService: TransactionService,
        private readonly lancamentosService: LancamentosService,
    ) { }

    async createJob(name: string, cronTime: string) {

        const existingJob = await this.cronJobRepository.findOne({ where: { name } });
        if (existingJob) {
            throw new BadRequestException(`Job ${name} já existe no banco.`);
        }

        const queryRunner = await this.transactionService.beginTransaction();

        try {
            const newJob = await queryRunner.manager.save(CronJobEntity, { name, cronTime });

            await this.transactionService.commitTransaction(queryRunner);

            // Agendar o job em memória imediatamente
            this.schedulerService.scheduleCronJob(newJob.name, newJob.cronTime);

            return newJob;
        } catch (e) {
            await this.transactionService.rollbackTransaction(queryRunner);
            throw e;
        }
    }

    async updateJobCron(name: string, cronTime: string) {
        const job = await this.cronJobRepository.findOne({ where: { name } });
        if (!job) {
            throw new BadRequestException(`Job ${name} não encontrado no banco.`);
        }

        // Atualiza a expressão Cron
        job.cronTime = cronTime;

        // Atualiza o job no banco de dados
        await this.updateJob(job.id, job);
    }

    async updateJobAtiveStatus(name: string, isActive: boolean) {
        const job = await this.cronJobRepository.findOne({ where: { name } });
        if (!job) {
            throw new BadRequestException(`Job ${name} não encontrado no banco.`);
        }

        // Atualiza o status de ativo/inativo
        job.isActive = isActive;

        // Atualiza o job no banco de dados
        await this.updateJob(job.id, job);
    }


    private async updateJob(id: number, job: CronJobEntity) {

        delete job['created_at'];
        delete job['updated_at'];
        delete job['id'];

        const queryRunner = await this.transactionService.beginTransaction();

        try {

            const jobResult = await queryRunner.manager
                .createQueryBuilder()
                .update(CronJobEntity)
                .set(job)
                .where('id = :id', { id })
                .execute();

            await this.transactionService.commitTransaction(queryRunner);

            // Atualiza o agendamento em memória imediatamente
            this.schedulerService.scheduleCronJob(job.name, job.cronTime);

            return jobResult;
        } catch (e) {
            await this.transactionService.rollbackTransaction(queryRunner);
            throw e;
        }

    }

    async runJob(name: string) {
        return this.schedulerService.triggerManually(name);
    }

}