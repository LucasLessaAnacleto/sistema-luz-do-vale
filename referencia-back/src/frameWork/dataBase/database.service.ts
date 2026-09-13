import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import * as fs from 'fs';
import { promises as fsPromises } from 'fs';
import { EmailService } from '../email/email.service';

const execAsync = promisify(exec);

@Injectable()
export class DatabaseService {
    private readonly logger = new Logger(DatabaseService.name);

    constructor(
      private readonly dataSource: DataSource,
      private readonly emailService: EmailService,
    ) { }

    /**
     * Executa o VACUUM no banco de dados.
     * @param tableName (Opcional) Nome da tabela específica. Se omitido, roda no banco inteiro.
     * @param full (Opcional) Se true, executa VACUUM FULL (requer lock exclusivo de tabela).
     */
    async executeVacuum(tableName?: string, full: boolean = false): Promise<void> {
        const vacuumType = full ? 'VACUUM FULL' : 'VACUUM';
        const target = tableName ? `"${tableName}"` : '';
        const query = `${vacuumType} ANALYZE ${target};`.trim();

        // 1. Criar um QueryRunner dedicado
        const queryRunner = this.dataSource.createQueryRunner();

        try {
            await queryRunner.connect();
            this.logger.log(`Iniciando execução: ${query}`);

            // 2. Executar a query fora de transação
            await queryRunner.query(query);

            this.logger.log(`VACUUM concluído com sucesso.`);
        } catch (error) {
            this.logger.error(`Erro ao executar VACUUM: ${error.message}`, error.stack);
            throw error;
        } finally {
            // 3. Sempre liberar o query runner
            await queryRunner.release();
        }
    }

    /**
   * Realiza o dump do banco de dados PostgreSQL.
   * @param outputDir Diretório onde o arquivo de backup será salvo.
   * @returns O caminho completo do arquivo gerado.
   */
  async createDump(outputDir: string = './backups'): Promise<void> {
    // 1. Garantir que o diretório de destino existe
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // 2. Extrair variáveis de ambiente da conexão
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || '5432';
    const user = process.env.DB_USERNAME || 'postgres';
    const password = process.env.DB_PASSWORD || '';
    const database = process.env.DB || 'meu_banco';
    const pgDumpPath = process.env.PG_DUMP_PATH || 'C:\\Program Files\\PostgreSQL\\18\\bin\\pg_dump.exe';

    // 3. Montar nome do arquivo com timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `backup-${database}-${timestamp}.sql`;
    const filePath = path.join(outputDir, fileName);

    // 4. Montar o comando pg_dump
    // Formato de texto (.sql). Para formato customizado/comprimido, use "-F c"
    const command = `"${pgDumpPath}" -h ${host} -p ${port} -U ${user} -d ${database} -F p -f "${filePath}"`;

    try {
      this.logger.log(`Iniciando dump do banco de dados '${database}'...`);

      // Passa a senha via variável de ambiente PGPASSWORD para evitar expor no comando
      await execAsync(command, {
        env: {
          ...process.env,
          PGPASSWORD: password,
        },
      });

      const fileBuffer = await fsPromises.readFile(filePath);
      const base64Content = fileBuffer.toString('base64');

      await this.emailService.create({
        destinatario: process.env.MAIL_FROM_ADDRESS || 'noreply@seudominio.com',
        assunto: `Backup do Banco de Dados - ${database}`,
        corpo: `O backup do banco de dados '${database}' foi gerado com sucesso.`,
        anexo: `data:text/plain;base64,${base64Content}`,
        nomeAnexo: fileName,
        status: 'PENDENTE',
      });

      this.logger.log(`Dump concluído com sucesso`);
    } catch (error) {
      this.logger.error(`Falha ao executar pg_dump: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Erro ao gerar o dump do banco de dados.');
    }
  }
}