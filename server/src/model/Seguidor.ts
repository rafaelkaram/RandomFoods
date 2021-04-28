import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { LogNotificacao } from './LogNotificacao';
import { Usuario } from './Usuario';

@Entity('seguidor')
@Unique([ 'usuario', 'seguidor' ])
export class Seguidor extends BaseEntity {
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
  log: LogNotificacao;
}