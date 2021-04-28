import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Ingrediente } from './Ingrediente';
import { ReceitaIngrediente } from './ReceitaIngrediente';
import { Medida } from './Medida';

@Entity('unidade')
export class Unidade extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'taxa_conversao', precision: 8, scale: 3 })
  taxaConversao: number;

  @ManyToOne(() => Ingrediente, ingrediente => ingrediente.unidades, { nullable: true })
  @JoinColumn({ name: 'ingrediente_id' })
  ingrediente: Ingrediente;

  @ManyToOne(() => Medida, medida => medida.unidades)
  @JoinColumn({ name: 'medida_id' })
  medida: Medida;

  @OneToMany(() => ReceitaIngrediente, receitaIngrediente => receitaIngrediente.unidade, { cascade: ['insert', 'update'], nullable: true })
  @JoinColumn({ name: 'unidade_id' })
  ingredientesReceitas: ReceitaIngrediente[];
}