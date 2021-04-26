import { BaseEntity, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { LogNotificacao } from './LogNotificacao';
import { Receita } from './Receita';
import { Usuario } from './Usuario';

@Entity('favorito')
@Unique([ 'usuario', 'receita' ])
export class Favorito extends BaseEntity {
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