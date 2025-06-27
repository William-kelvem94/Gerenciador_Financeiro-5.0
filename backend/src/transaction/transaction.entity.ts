import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export type TransactionType = 'income' | 'expense';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  descricao!: string;

  @Column('decimal', { precision: 12, scale: 2 })
  valor!: number;

  @Column({ type: 'date' })
  data!: string;

  @Column()
  categoria!: string;

  @Column({ type: 'varchar' })
  tipo!: TransactionType;

  @Column({ nullable: true })
  conta?: string;

  @Column({ nullable: true })
  observacao?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
