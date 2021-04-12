import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ReceitaIngrediente } from './ReceitaIngrediente';
import { TipoUnidade } from './TipoUnidade';
import { Unidade } from './Unidade';

export enum TipoIngrediente {
  ADOCANTE = 'Adoçante',
  BEBIDA = 'Bebida',
  CARNE = 'Carne',
  CONFEITARIA = 'Confeitaria',
  GRAO = 'Grão',
  FRUTA = 'Fruta',
  FRUTO_DO_MAR = 'Fruto do Mar',
  LATICINIO = 'Lacticínio',
  LEGUME = 'Legume',
  MASSA = 'Massa',
  MOLHO = 'Molho',
  OLEO = 'Óleo',
  OUTROS = 'Outros',
  SEMENTE = 'Semente',
  TEMPERO = 'Tempero',
  VEGETAL = 'Vegetal'
}

@Entity('ingrediente')
export class Ingrediente {
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
  @JoinColumn({ name: 'id_ingrediente' })
  ingredienteReceitas: ReceitaIngrediente[];

  @OneToMany(() => Unidade, unidade => unidade.ingrediente, { cascade: ['insert', 'update'] })
  @JoinColumn({ name: 'id_ingrediente' })
  unidades: Unidade[];
}