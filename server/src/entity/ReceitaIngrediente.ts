import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Ingrediente } from './Ingrediente';
import { Receita } from './Receita';
import { Unidade } from './Unidade';

@Entity('receita_ingrediente')
@Unique([ 'receita', 'ingrediente' ])
export class ReceitaIngrediente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantidade: number;

  @ManyToOne(() => Unidade, unidade => unidade.ingredientesReceitas)
  @JoinColumn({ name: 'id_unidade' })
  unidade: Unidade;

  @ManyToOne(() => Ingrediente, ingrediente => ingrediente.ingredienteReceitas)
  @JoinColumn({ name: 'id_ingrediente' })
  ingrediente: Ingrediente;

  @ManyToOne(() => Receita, receita => receita.ingredientesReceita)
  @JoinColumn({ name: 'id_receita' })
  receita: Receita;
}