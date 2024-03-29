import { BaseEntity, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Comentario } from './Comentario';
import { LogNotificacao } from './LogNotificacao';
import { Usuario } from './Usuario';

@Entity('marca')
@Unique([ 'usuario', 'comentario' ])
export class Marca extends BaseEntity {
  constructor(usuario: Usuario, comentario: Comentario, log: LogNotificacao) {
    super();
    this.usuario = usuario;
    this.comentario = comentario;
    this.log = log;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Usuario, usuario => usuario.marcas)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => Comentario, comentario => comentario.marcas)
  @JoinColumn({ name: 'comentario_id' })
  comentario: Comentario;

  @OneToOne(() => LogNotificacao)
  log: LogNotificacao;
}