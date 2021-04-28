import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { LogNotificacao } from './LogNotificacao';
import { Receita } from './Receita';
import { Usuario } from './Usuario';

@Entity('avaliacao')
@Unique([ 'usuario', 'receita' ])
export class Avaliacao extends BaseEntity {
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