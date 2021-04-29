import { BaseEntity, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { LogNotificacao } from './LogNotificacao';
import { Receita } from './Receita';
import { Usuario } from './Usuario';

@Entity('favorito')
@Unique([ 'usuario', 'receita' ])
export class Favorito extends BaseEntity {
  constructor(usuario: Usuario, receita: Receita, log: LogNotificacao) {
    super();
    this.usuario = usuario;
    this.receita = receita;
    this.log = log;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Usuario, usuario => usuario.favoritos)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => Receita, receita => receita.favoritos)
  @JoinColumn({ name: 'receita_id' })
  receita: Receita;

  @OneToOne(() => LogNotificacao)
  log: LogNotificacao;
}