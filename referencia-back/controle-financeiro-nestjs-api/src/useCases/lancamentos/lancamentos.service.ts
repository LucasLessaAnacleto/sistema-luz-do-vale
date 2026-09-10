/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier

import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateLancamentoDto } from './dto/create-lancamento.dto';
import { UpdateLancamentoDto } from './dto/update-lancamento.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Lancamentos } from './entities/lancamentos.entity';
import { Repository } from 'typeorm';
import { TransactionService } from '../../frameWork/transaction/transaction.service';

@Injectable()
export class LancamentosService {
  constructor(
    @InjectRepository(Lancamentos)
    private lancamentosRepository: Repository<Lancamentos>,
    private readonly transactionService: TransactionService,
  ) {}

  async create(createLancamentoDto: CreateLancamentoDto) {
    const queryRunner = await this.transactionService.beginTransaction();

    try {
      const lancamento = await queryRunner.manager.save(Lancamentos, createLancamentoDto);

      await this.transactionService.commitTransaction(queryRunner);

      return lancamento;
    } catch (e) {
      await this.transactionService.rollbackTransaction(queryRunner);
      throw e;
    }
  }

  findAll(query: any) {
    return this.lancamentosRepository.find({
      where: query,
      order: {
        id: 'ASC',
      },
    });
  }

  async findById(id: number) {
    const lancamentoResult = await this.lancamentosRepository.findOneBy({
      id,
    });

    if (!lancamentoResult) {
      throw new BadRequestException('Lançamento não encontrado');
    }

    return lancamentoResult;
  }

  async update(id: number, updateLancamentoDto: UpdateLancamentoDto) {
    const lancamentoResult = await this.findById(id);
    if (!lancamentoResult) {
      throw new BadRequestException('Cliente não encontrado');
    }

    delete updateLancamentoDto['created_at'];
    delete updateLancamentoDto.id;

    const queryRunner = await this.transactionService.beginTransaction();

    try {
      const lancamento = await queryRunner.manager
        .createQueryBuilder()
        .update(Lancamentos)
        .set(updateLancamentoDto)
        .where('id = :id', { id })
        .execute();

      await this.transactionService.commitTransaction(queryRunner);

      return lancamento;
    } catch (e) {
      await this.transactionService.rollbackTransaction(queryRunner);
      throw e;
    }
  }

  async remove(id: number) {
    const lancamentoResult = await this.findById(id);
    if (!lancamentoResult) {
      throw new BadRequestException('Lançamento não encontrado');
    }

    const queryRunner = await this.transactionService.beginTransaction();

    try {
      await queryRunner.manager.remove(Lancamentos, lancamentoResult);

      await this.transactionService.commitTransaction(queryRunner);
    } catch (e) {
      await this.transactionService.rollbackTransaction(queryRunner);

      throw e;
    }

    return "Lançamento removido com sucesso!";
  }

  async healthCheck() {
    try {
      await this.lancamentosRepository
        .createQueryBuilder()
        .select('1')
        .getRawOne();

    } catch (error) {
      throw new BadRequestException('Falha na conexão com o banco de dados');
    }
  }
}
