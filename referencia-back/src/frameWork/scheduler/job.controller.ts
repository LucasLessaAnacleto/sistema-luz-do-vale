import { Controller, Post, Body, Param, Patch, Put, UseGuards } from '@nestjs/common';
import { JobsService } from './job.service';
import { JwtAuthGuard } from 'src/useCases/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('jobs')
export class JobsController {
  constructor(
    private readonly jobsService: JobsService,
  ) {}

  // Endpoint para criar um novo job
  @Post()
  async createJob(@Body('name') name: string, @Body('cronTime') cronTime: string) {
    return await this.jobsService.createJob(name, cronTime);
  }


  // Endpoint para disparo manual imediato
  @Post(':name/run')
  async runJob(@Param('name') name: string) {
    return await this.jobsService.runJob(name);
  }

  // Endpoint para atualizar a expressão Cron no BD e re-agendar
  @Put(':name/cron')
  async updateJobCron(
    @Param('name') name: string,
    @Body('cronTime') cronTime: string,
  ) {
    return await this.jobsService.updateJobCron(name, cronTime);
  }

  // Endpoint para atualizar o status de ativo/inativo no BD e re-agendar
  @Patch(':name/status')
  async updateJobAtiveStatus(
    @Param('name') name: string,
    @Body('isActive') isActive: boolean,
  ) {
    return await this.jobsService.updateJobAtiveStatus(name, isActive);
  }
}