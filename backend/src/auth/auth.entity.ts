import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  name!: string;

  @Column()
  password!: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ type: 'json', nullable: true })
  preferences?: {
    theme: 'light' | 'dark' | 'system';
    currency: string;
    language: 'pt' | 'en';
    notifications: {
      budget: boolean;
      goals: boolean;
      transactions: boolean;
    };
  };

  @Column({ default: true })
  active!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
