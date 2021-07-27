import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Avaliacao } from './Avaliacao';
import { Categoria } from './Categoria';
import { Comentario } from './Comentario';
import { Curtida } from './Curtida';
import { LogNotificacao } from './LogNotificacao';
import { Midia } from './Midia';
import { ReceitaIngrediente } from './ReceitaIngrediente';
import { Usuario } from './Usuario';

export enum Tipo {
  DOCE = 'Doce',
  SALGADO = 'Salgado'
}

@Entity('receita')
@Unique([ 'usuario', 'nome' ])
export class Receita extends BaseEntity {
  constructor(nome: string, descricao: string, tempoPreparo: number, porcoes: number, tipo: Tipo, usuario: Usuario) {
    super();
    this.nome = nome;
    this.descricao = descricao;
    this.tempoPreparo = tempoPreparo;
    this.tipo = tipo;
    this.usuario = usuario;
    this.porcoes = porcoes;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nome: string;

  @Column()
  descricao: string;

  @Column()
  porcoes: number;

  @Column({ name: 'tempo_preparo' })
  tempoPreparo: number;

  @Column({ type: 'enum', enum: Tipo })
  tipo: Tipo;

  @CreateDateColumn({ name: 'data_cadastro' })
  dataCadastro: Date;

  @Column({ default: true })
  ativa: boolean;

  @ManyToOne(() => Usuario, usuario => usuario.receitas)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @OneToMany(() => Categoria, categoria => categoria.receita, { cascade: ['insert', 'update'], nullable: true })
  @JoinColumn({ name: 'receita_id' })
  categorias: Categoria[];

  @OneToMany(() => ReceitaIngrediente, ingrediente => ingrediente.receita, { cascade: ['insert', 'update'] })
  @JoinColumn({ name: 'receita_id' })
  ingredientesReceita: ReceitaIngrediente[];

  @OneToMany(() => Avaliacao, avaliacao => avaliacao.receita, { cascade: ['insert', 'update'], nullable: true })
  @JoinColumn({ name: 'receita_id' })
  avaliacoes: Avaliacao[];

  @OneToMany(() => Comentario, comentario => comentario.receita, { cascade: ['insert', 'update'], nullable: true })
  @JoinColumn({ name: 'receita_id' })
  comentarios: Comentario[];

  @OneToMany(() => Midia, midia => midia.receita, { cascade: ['insert', 'update'], nullable: true })
  @JoinColumn({ name: 'receita_id' })
  midias: Midia[];

  @OneToMany(() => Curtida, curtida => curtida.receita, { cascade: ['insert', 'update'], nullable: true })
  @JoinColumn({ name: 'receita_id' })
  curtidas: Curtida[];

  @OneToMany(() => LogNotificacao, logNotificacao => logNotificacao.receita, { cascade: ['insert', 'update'], nullable: true })
  @JoinColumn({ name: 'receita_id' })
  logsNotificacao: LogNotificacao[];
}