import { BaseEntity, Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Unidade } from './Unidade';
import { TipoUnidade } from './TipoUnidade';

@Entity('medida')
@Unique([ 'nome', 'tipo_unidade' ])
export class Medida extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  valor: number;

  @Column({ name: 'tipo_unidade', type: 'enum', enum: TipoUnidade })
  tipoUnidade: TipoUnidade;

  @OneToMany(() => Unidade, unidade => unidade.medida, { cascade: ['insert', 'update'] })
  @JoinColumn({ name: 'medida_id' })
  unidades: Unidade[];
}