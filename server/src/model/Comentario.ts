import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Usuario } from './Usuario';
import { Receita } from './Receita';
import { LogNotificacao } from './LogNotificacao';
import { Marca } from './Marca';

@Entity('comentario')
export class Comentario extends BaseEntity {
  constructor(valor: string, usuario: Usuario, receita: Receita, log: LogNotificacao) {
    super();
    this.valor = valor;
    this.usuario = usuario;
    this.receita = receita;
    this.log = log;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  valor: string;

  @CreateDateColumn()
  data: Date;

  @ManyToOne(() => Comentario, comentario => comentario.comentarioPai, { nullable: true })
  @JoinColumn({ name: 'pai_id' })
  comentarioPai: Comentario;

  @ManyToOne(() => Usuario, usuario => usuario.comentarios)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => Receita, receita => receita.comentarios)
  @JoinColumn({ name: 'receita_id' })
  receita: Receita;

  @OneToMany(() => Marca, marca => marca.comentario, { cascade: ['insert', 'update'] })
  @JoinColumn({ name: 'comentario_id' })
  marcas: Marca[];

  @OneToOne(() => LogNotificacao)
  log: LogNotificacao;

  @OneToOne(() => LogNotificacao, { nullable: true })
  logResposta: LogNotificacao;
}