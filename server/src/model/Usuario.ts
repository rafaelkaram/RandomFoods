import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Avaliacao } from './Avaliacao';
import { Comentario } from './Comentario';
import { Curtida } from './Curtida';
import { LogNotificacao } from './LogNotificacao';
import { Marca } from './Marca';
import { Receita } from './Receita';
import { Seguidor } from './Seguidor';

export enum Perfil {
  ADMIN = 'Admin',
  PRO = 'Pro',
  VERIFICADO = 'Verificado',
  USUARIO = 'Usuario'
}

@Entity('usuario')
export class Usuario extends BaseEntity {
  constructor(login: string, email: string, senha: string) {
    super();
    this.login = login;
    this.email = email;
    this.senha = senha;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'id_externo', length: 64, nullable: true })
  idExterno: string;

  @Column({ length: 20, unique: true })
  login: string;

  @Column({ length: 64, nullable: true })
  nome: string;

  @Column({ length: 30, unique: true })
  email: string;

  @Column({ length: 64 })
  senha: string;

  @CreateDateColumn({ name: 'data_cadastro' })
  dataCadastro: Date;

  @Column({ default: true })
  ativo: boolean;

  @Column({ name: 'troca_login', default: false })
  trocaLogin: boolean;

  @Column({ type: 'enum', enum: Perfil, default: Perfil.USUARIO })
  perfil: Perfil;

  @Column({ name: 'notificar_seguidor', default: true })
  notificarSeguidor: boolean;

  @Column({ name: 'notificar_avaliacao', default: true })
  notificarAvaliacao: boolean;

  @Column({ name: 'notificar_comentario', default: true })
  notificarComentario: boolean;

  @Column({ name: 'notificar_favorito', default: true })
  notificarCurtida: boolean;

  @Column({ name: 'notificar_resposta', default: true })
  notificarResposta: boolean;

  @Column({ name: 'notificar_marca', default: true })
  notificarMarca: boolean;

  @OneToMany(() => Seguidor, seguidor => seguidor.usuario, { cascade: ['insert', 'update'], nullable: true })
  @JoinColumn({ name: 'usuario_id' })
  seguidos: Seguidor[];

  @OneToMany(() => Seguidor, seguidor => seguidor.seguidor, { cascade: ['insert', 'update'], nullable: true })
  @JoinColumn({ name: 'seguidor_id' })
  seguidores: Seguidor[];

  @OneToMany(() => Receita, receita => receita.usuario, { cascade: ['insert', 'update'], nullable: true })
  @JoinColumn({ name: 'usuario_id' })
  receitas: Receita[];

  @OneToMany(() => Avaliacao, avaliacao => avaliacao.usuario, { cascade: ['insert', 'update'], nullable: true })
  @JoinColumn({ name: 'usuario_id' })
  avaliacoes: Avaliacao[];

  @OneToMany(() => Comentario, comentario => comentario.usuario, { cascade: ['insert', 'update'], nullable: true })
  @JoinColumn({ name: 'usuario_id' })
  comentarios: Comentario[];

  @OneToMany(() => Curtida, curtida => curtida.usuario, { cascade: ['insert', 'update'], nullable: true })
  @JoinColumn({ name: 'usuario_id' })
  curtidas: Curtida[];

  @OneToMany(() => Marca, marca => marca.usuario, { cascade: ['insert', 'update'], nullable: true })
  @JoinColumn({ name: 'usuario_id' })
  marcas: Marca[];

  @OneToMany(() => LogNotificacao, logNotificacao => logNotificacao.usuario, { cascade: ['insert', 'update'], nullable: true })
  @JoinColumn({ name: 'usuario_id' })
  logsNotificacao: LogNotificacao[];
}