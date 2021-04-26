import { BaseEntity, Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ReceitaIngrediente } from './ReceitaIngrediente';
import { TipoUnidade } from './TipoUnidade';
import { Unidade } from './Unidade';

export enum TipoIngrediente {
  BEBIDA = 'Bebidas',
  CARNE = 'Carnes',
  CONDIMENTO = 'Condimentos',
  CONFEITARIA = 'Confeitaria',
  GRAO = 'Grãos',
  FRUTA = 'Frutas',
  FRUTO_DO_MAR = 'Frutos do Mar',
  LATICINIO = 'Lacticínios',
  LEGUME = 'Legumes',
  MASSA = 'Massas',
  MOLHO = 'Molhos',
  NOZ = 'Nozes',
  OLEO = 'Óleos',
  OUTROS = 'Outros',
  PEIXE = 'Peixes',
  TEMPERO = 'Temperos',
  VEGETAL = 'Vegetais'
}

@Entity('ingrediente')
export class Ingrediente extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  nome: string;

  @Column({ name: 'sem_medida' })
  semMedida: boolean;

  @Column({ name: 'derivado_leite' })
  derivadoLeite: boolean;

  @Column()
  gluten: boolean;

  @Column({ name: 'tipo_ingrediente', type: 'enum', enum: TipoIngrediente })
  tipoIngrediente: TipoIngrediente;

  @Column({ name: 'tipo_unidade', type: 'enum', enum: TipoUnidade })
  tipoUnidade: TipoUnidade;

  @OneToMany(() => ReceitaIngrediente, receitaIngrediente => receitaIngrediente.ingrediente, { cascade: ['insert', 'update'] })
  @JoinColumn({ name: 'ingrediente_id' })
  ingredienteReceitas: ReceitaIngrediente[];

  @OneToMany(() => Unidade, unidade => unidade.ingrediente, { cascade: ['insert', 'update'], nullable: true })
  @JoinColumn({ name: 'ingrediente_id' })
  unidades: Unidade[];
}