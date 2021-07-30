import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { LogNotificacao } from './LogNotificacao';
import { Usuario } from './Usuario';

@Entity('seguidor')
@Unique([ 'usuario', 'seguidor' ])
export class Seguidor extends BaseEntity {
  constructor(usuario: Usuario, seguidor: Usuario, log: LogNotificacao) {
    super();
    this.usuario = usuario;
    this.seguidor = seguidor;
    this.log = log;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: true })
  notificar: boolean;

  @ManyToOne(() => Usuario, usuario => usuario.seguidos)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => Usuario, usuario => usuario.seguidores)
  @JoinColumn({ name: 'seguidor_id' })
  seguidor: Usuario;

  @OneToOne(() => LogNotificacao)
  @JoinColumn({ name: 'id' })
  log: LogNotificacao;
}