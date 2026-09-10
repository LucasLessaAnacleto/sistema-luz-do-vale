import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { CronJobEntity } from './entity/cron.entity';
import { JobsController } from './job.controller';
import { JobsService } from './job.service';
import { TransactionService } from '../transaction/transaction.service';
import { SchedulerService } from './scheduler.service';
import { DatabaseService } from '../database/database.service';
import { EmailModule } from '../email/email.module';
import { LancamentosModule } from 'src/useCases/lancamentos/lancamentos.module';

@Module({
  imports: [TypeOrmModule.forFeature([CronJobEntity]), ScheduleModule.forRoot(), EmailModule, LancamentosModule],
  controllers: [JobsController],
  providers: [TransactionService, JobsService, SchedulerService, DatabaseService],
  exports: [JobsService, SchedulerService, DatabaseService],
})
export class JobsModule { }