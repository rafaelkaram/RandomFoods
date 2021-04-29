import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Avaliacao } from './Avaliacao';
import { Comentario } from './Comentario';
import { Favorito } from './Favorito';
import { Marca } from './Marca';
import { Receita } from './Receita';
import { Seguidor } from './Seguidor';
import { Usuario } from './Usuario';

@Entity('log_notificacao')
export class LogNotificacao extends BaseEntity {
  constructor(usuario: Usuario) {
    super();
    this.usuario = usuario;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: true })
  ativa: boolean;

  @Column({ default: false })
  visualizada: boolean;

  @CreateDateColumn()
  data: Date;

  @ManyToOne(() => Usuario, usuario => usuario.logsNotificacao)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => Receita, receita => receita.logsNotificacao, { nullable: true })
  @JoinColumn({ name: 'receita_id' })
  receita: Receita;

  @OneToOne(() => Seguidor, seguidor => seguidor.log, { nullable: true })
  @JoinColumn({ name: 'seguidor_id' })
  seguidor: Seguidor;

  @OneToOne(() => Comentario, comentario => comentario.log, { nullable: true })
  @JoinColumn({ name: 'comentario_id' })
  comentario: Comentario;

  @OneToOne(() => Avaliacao, avaliacao => avaliacao.log, { nullable: true })
  @JoinColumn({ name: 'avaliacao_id' })
  avaliacao: Avaliacao;

  @OneToOne(() => Favorito, favorito => favorito.log, { nullable: true })
  @JoinColumn({ name: 'favorito_id' })
  favorito: Favorito;

  @OneToOne(() => Comentario, comentario => comentario.logResposta, { nullable: true })
  @JoinColumn({ name: 'resposta_id' })
  resposta: Comentario;

  @OneToOne(() => Marca, marca => marca.log, { nullable: true })
  @JoinColumn({ name: 'marca_id' })
  marca: Marca;
}