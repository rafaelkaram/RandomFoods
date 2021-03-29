import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Avaliacao } from './Avaliacao';
import { Comentario } from './Comentario';
import { Receita } from './Receita';

@Entity('usuario')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nome: string;

  @Column({ length: 50, unique: true })
  email: string;

  @Column({ length: 64 })
  senha: string;

  @CreateDateColumn({ name: 'data_cadastro' })
  dataCadastro: Date;

  @CreateDateColumn({ name: 'data_ultimo_acesso' })
  dataUltimoAcesso: Date;

  @Column({ default: true })
  ativo: boolean;

  @OneToMany(() => Receita, receita => receita.usuario, { cascade: ['insert', 'update'] })
  @JoinColumn({ name: 'id_usuario' })
  receitas: Receita[];

  @OneToMany(() => Avaliacao, avaliacao => avaliacao.usuario, { cascade: ['insert', 'update'] })
  @JoinColumn({ name: 'id_usuario' })
  avaliacoes: Avaliacao[];

  @OneToMany(() => Comentario, comentario => comentario.usuario, { cascade: ['insert', 'update'] })
  @JoinColumn({ name: 'id_usuario' })
  comentarios: Comentario[];
}