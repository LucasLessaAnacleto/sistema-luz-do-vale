import { Audit } from 'src/useCases/audit/audit.decorator';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
@Audit()
export class Lancamentos {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  descricao: string;

  @Column()
  mes: number;

  @Column()
  ano: number;

  @Column({ type: 'double precision' })
  valor: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column()
  situacao: 'PENDENTE' | 'PAGO';
}
