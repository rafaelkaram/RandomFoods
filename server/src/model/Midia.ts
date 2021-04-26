import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Receita } from './Receita';

export enum Tipo {
  FOTO = 'FOTO',
  VIDEO = 'VIDEO'
}

@Entity('midia')
export class Midia extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  path: string;

  @Column({ type: 'enum', enum: Tipo })
  tipo: Tipo;

  @CreateDateColumn({ name: 'data_cadastro' })
  dataCadastro: Date;

  @Column({ default: true })
  ativa: boolean;

  @ManyToOne(() => Receita, receita => receita.midias)
  @JoinColumn({ name: 'receita_id' })
  receita: Receita;
}