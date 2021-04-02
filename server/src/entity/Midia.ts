import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Receita } from './Receita';

export enum Tipo {
  FOTO = 'FOTO',
  VIDEO = 'VIDEO'
}

@Entity('midia')
export class Midia {
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
  @JoinColumn({ name: 'id_receita' })
  receita: Receita;
}