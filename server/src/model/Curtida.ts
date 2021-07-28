import { BaseEntity, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { LogNotificacao } from './LogNotificacao';
import { Receita } from './Receita';
import { Usuario } from './Usuario';

@Entity('curtida')
@Unique([ 'usuario', 'receita' ])
export class Curtida extends BaseEntity {
  constructor(usuario: Usuario, receita: Receita, log: LogNotificacao) {
    super();
    this.usuario = usuario;
    this.receita = receita;
    this.log = log;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Usuario, usuario => usuario.curtidas)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => Receita, receita => receita.curtidas)
  @JoinColumn({ name: 'receita_id' })
  receita: Receita;

  @OneToOne(() => LogNotificacao)
  @JoinColumn({ name: 'id' })
  log: LogNotificacao;
}