import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Ingrediente } from './Ingrediente';
import { ReceitaIngrediente } from './ReceitaIngrediente';
import { TipoUnidade } from './TipoUnidade';

@Entity('unidade')
export class Unidade {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nome: string;

  @Column()
  sigla: string;

  @Column({ name: 'taxa_conversao', precision: 8, scale: 3 })
  taxaConversao: number;

  @Column({ type: 'enum', enum: TipoUnidade })
  tipo: TipoUnidade;

  @ManyToOne(() => Ingrediente, ingrediente => ingrediente.unidades)
  @JoinColumn({ name: 'id_ingrediente' })
  ingrediente: Ingrediente;

  @OneToMany(() => ReceitaIngrediente, receitaIngrediente => receitaIngrediente.unidade, { cascade: ['insert', 'update'] })
  @JoinColumn({ name: 'id_unidade' })
  ingredientesReceitas: ReceitaIngrediente[];
}