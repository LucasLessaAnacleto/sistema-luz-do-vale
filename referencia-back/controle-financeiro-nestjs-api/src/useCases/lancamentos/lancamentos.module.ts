/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier

import { Module } from '@nestjs/common';
import { LancamentosService } from './lancamentos.service';
import { LancamentosController } from './lancamentos.controller';
import { Lancamentos } from './entities/lancamentos.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionService } from '../../frameWork/transaction/transaction.service';

@Module({
  imports: [TypeOrmModule.forFeature([Lancamentos])],
  controllers: [LancamentosController],
  providers: [LancamentosService, TransactionService],
  exports: [LancamentosService],
})
export class LancamentosModule {}
