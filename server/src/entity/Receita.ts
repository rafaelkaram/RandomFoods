import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Avaliacao } from './Avaliacao';
import { Categoria } from './Categoria';
import { Comentario } from './Comentario';
import { Midia } from './Midia';
import { ReceitaIngrediente } from './ReceitaIngrediente';
import { Usuario } from './Usuario';

export enum Tipo {
  DOCE = 'Doce',
  SALGADO = 'Salgado'
}

@Entity('receita')
@Unique([ 'usuario', 'nome' ])
export class Receita {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nome: string;

  @Column()
  descricao: string;

  @Column({ type: 'enum', enum: Tipo })
  tipo: Tipo;

  @CreateDateColumn({ name: 'data_cadastro' })
  dataCadastro: Date;

  @Column({ default: true })
  ativa: boolean;

  @ManyToOne(() => Usuario, usuario => usuario.receitas)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @OneToMany(() => Categoria, categoria => categoria.receita, { cascade: ['insert', 'update'] })
  @JoinColumn({ name: 'id_receita' })
  categorias: Categoria[];

  @OneToMany(() => ReceitaIngrediente, ingrediente => ingrediente.receita, { cascade: ['insert', 'update'] })
  @JoinColumn({ name: 'id_receita' })
  ingredientesReceita: ReceitaIngrediente[];

  @OneToMany(() => Avaliacao, avaliacao => avaliacao.receita, { cascade: ['insert', 'update'] })
  @JoinColumn({ name: 'id_receita' })
  avaliacoes: Avaliacao[];

  @OneToMany(() => Comentario, comentario => comentario.receita, { cascade: ['insert', 'update'] })
  @JoinColumn({ name: 'id_receita' })
  comentarios: Comentario[];

  @OneToMany(() => Midia, midia => midia.receita, { cascade: ['insert', 'update'] })
  @JoinColumn({ name: 'id_receita' })
  midias: Midia[];
}