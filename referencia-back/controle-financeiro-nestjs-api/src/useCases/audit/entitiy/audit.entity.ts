/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier

import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';


@Entity()
export class Audit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  entityName: string;

  @Column()
  entityId: string;

  @Column({ nullable: true })
  userId: number;

  @Column({type: 'json', nullable: true})
  oldState: Record<string, any> | null;

  @Column({type: 'json', nullable: true})
  newState: Record<string, any> | null;

  @Column()
  action: 'INSERT' | 'UPDATE' | 'DELETE';

  @CreateDateColumn()
  createdAt: Date;
}
