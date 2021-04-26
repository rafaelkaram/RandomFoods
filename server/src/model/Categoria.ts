import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Receita } from './Receita';

export enum Tipo {
  DIET = 'Diet',
  LIGHT = 'Light',
  FITNESS = 'Fitness',
  VEGANA = 'Vegana',
  VEGETARIANA = 'Vegetariana'
}


@Entity('categoria')
export class Categoria extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: Tipo })
  nome: Tipo;

  @ManyToOne(() => Receita, receita => receita.categorias)
  @JoinColumn({ name: 'receita_id' })
  receita: Receita;
}