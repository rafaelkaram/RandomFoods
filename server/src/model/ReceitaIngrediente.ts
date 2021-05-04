import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Ingrediente } from './Ingrediente';
import { Receita } from './Receita';
import { Unidade } from './Unidade';

@Entity('receita_ingrediente')
@Unique([ 'receita', 'ingrediente' ])
export class ReceitaIngrediente extends BaseEntity {
  constructor(ingrediente: Ingrediente, receita: Receita) {
    super();
    this.ingrediente = ingrediente;
    this.receita = receita;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  quantidade: number;

  @ManyToOne(() => Unidade, unidade => unidade.ingredientesReceitas, { nullable: true })
  @JoinColumn({ name: 'unidade_id' })
  unidade: Unidade;

  @ManyToOne(() => Ingrediente, ingrediente => ingrediente.ingredienteReceitas)
  @JoinColumn({ name: 'ingrediente_id' })
  ingrediente: Ingrediente;

  @ManyToOne(() => Receita, receita => receita.ingredientesReceita)
  @JoinColumn({ name: 'receita_id' })
  receita: Receita;
}