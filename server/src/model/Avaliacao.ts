import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { LogNotificacao } from './LogNotificacao';
import { Receita } from './Receita';
import { Usuario } from './Usuario';

@Entity('avaliacao')
@Unique([ 'usuario', 'receita' ])
export class Avaliacao extends BaseEntity {
  constructor(nota: number, usuario: Usuario, receita: Receita, log: LogNotificacao) {
    super();
    this.nota = nota;
    this.usuario = usuario;
    this.receita = receita;
    this.log = log;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nota: number;

  @CreateDateColumn()
  data: Date;

  @ManyToOne(() => Usuario, usuario => usuario.avaliacoes)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => Receita, receita => receita.avaliacoes)
  @JoinColumn({ name: 'receita_id' })
  receita: Receita;

  @OneToOne(() => LogNotificacao)
  log: LogNotificacao;
}