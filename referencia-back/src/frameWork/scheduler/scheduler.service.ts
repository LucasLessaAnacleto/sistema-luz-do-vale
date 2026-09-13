
import { CronJobEntity } from "./entity/cron.entity";
import { SchedulerRegistry } from '@nestjs/schedule';
import { Repository } from "typeorm";
import { CronJob } from '@nestjs/schedule/node_modules/cron';
import { Injectable, Logger, NotFoundException, OnApplicationBootstrap } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { DatabaseService } from "../database/database.service";
import { EmailService } from "../email/email.service";
import { LancamentosService } from "src/useCases/lancamentos/lancamentos.service";


@Injectable()
export class SchedulerService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SchedulerService.name);

  // Mapeamento das funções reais associadas a cada job
  private readonly jobHandlers: Record<string, () => Promise<void>> = {
    VACCUM_DATABASE: async () => await this.executevacuumDatabase(),
    BACKUP_DATABASE: async () => await this.databaseService.createDump(),
    SEND_EMAILS: async () => await this.emailService.enviarEmailsPendentes(),
    HEALTH_CHECK: async () => await this.lancamentosService.healthCheck(),
  };

  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    @InjectRepository(CronJobEntity)
    private readonly cronJobRepository: Repository<CronJobEntity>,
    private readonly databaseService: DatabaseService,
    private readonly emailService: EmailService,
    private readonly lancamentosService: LancamentosService,
  ) { }

  // 1. Carrega os jobs do TypeORM ao inicializar a aplicação
  async onApplicationBootstrap() {
    const jobs = await this.cronJobRepository.find({ where: { isActive: true } });
    for (const job of jobs) {
      this.scheduleCronJob(job.name, job.cronTime);
    }
  }

  // 2. Cria ou atualiza o timer Cron em memória
  scheduleCronJob(name: string, cronTime: string) {
    const handler = this.jobHandlers[name];
    if (!handler) {
      this.logger.warn(`Handler não encontrado para o job: ${name}`);
      return;
    }

    // Se o job já existia na memória, deleta para reagendar com o novo horário
    if (this.schedulerRegistry.doesExist('cron', name)) {
      this.schedulerRegistry.deleteCronJob(name);
    }

    const job = new CronJob(cronTime, async () => {
      this.logger.log(`Executando job agendado: ${name}`);
      try {
        await handler();
        this.logger.log(`Job ${name} concluído.`);
      } catch (error) {
        this.logger.error(`Erro durante a execução do job [${name}]:`, error);
      }
    });

    this.schedulerRegistry.addCronJob(name, job);
    job.start();
    this.logger.log(`Job [${name}] agendado: ${cronTime}`);
  }

  // 3. Disparo Manual (Executa a lógica na hora sem alterar o cron)
  async triggerManually(name: string) {
    const handler = this.jobHandlers[name];
    if (!handler) {
      throw new NotFoundException(`Job ${name} não possui um handler registrado.`);
    }

    this.logger.log(`Disparo manual executado para: ${name}`);
    await handler();
    return { message: `Job ${name} executado com sucesso.` };
  }

  private async executevacuumDatabase() {
    await this.databaseService.executeVacuum(null, true);
  }

}
