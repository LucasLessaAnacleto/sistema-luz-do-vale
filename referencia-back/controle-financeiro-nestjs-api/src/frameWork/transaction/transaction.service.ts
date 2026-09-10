/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier

import { Injectable } from "@nestjs/common";
import { DataSource, QueryRunner } from 'typeorm';
import { userContextStorage } from "../../useCases/auth/user-context.storage";

@Injectable()
export class TransactionService {
    constructor(private readonly dataSource: DataSource) {}

  async beginTransaction(): Promise<QueryRunner> {
    const store = userContextStorage.getStore();
    
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    console.log(">>>" , store);
    // seta o id do usuario na transação, para o audit funcionar corretamente
    if (store?.userId) {
        try {

            await queryRunner.query(
                "SELECT set_config('app.current_user_id', $1, true);",
                [store.userId]
            );
        } catch {
            // Ignora silenciosamente se falhar
        }
    }

    return queryRunner;
  }

  async commitTransaction(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.commitTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async rollbackTransaction(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}