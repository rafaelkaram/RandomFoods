import { EntityRepository, Repository } from 'typeorm';

import { Ingrediente } from '../model/Ingrediente';
import { Medida } from '../model/Medida';
import { TipoUnidade } from '../model/TipoUnidade';
import { Unidade } from '../model/Unidade';

@EntityRepository(Unidade)
export class UnidadeRepository extends Repository<Unidade> {

  async findAll(): Promise<Unidade[]> {
    return this.findOrdered('id', true)
  }

  async findOrdered(order: string, ascending: boolean): Promise<Unidade[]> {
    const unidades: Unidade[] = await this.createQueryBuilder()
      .orderBy(order, ascending ? 'ASC' : 'DESC')
      .getMany();

    return unidades;
  }

  async findWithIngrediente(): Promise<Unidade[]> {
    const unidades: Unidade[] = await this.find({ relations: [ 'ingrediente' ], order: { id: 'ASC' } });

    return unidades;
  }

  async findBySigla(medida: Medida, ingredientes: Ingrediente[]): Promise<Unidade> {
    const unidade: Unidade = await this.createQueryBuilder('u')
      .innerJoinAndSelect('u.medida', 'm')
      .where('u.ingrediente IN (:...ingredientes)', { ingredientes })
      .andWhere('u.medida = :medida', { medida: medida.id })
      .getOneOrFail();

    return unidade;
  }

  async findByIngredient(medida: Medida, ingrediente: Ingrediente): Promise<Unidade> {
    const unidade: Unidade = await this.createQueryBuilder('u')
      .innerJoinAndSelect('u.medida', 'm')
      .where('u.medida = :medida', { medida: medida.id })
      .andWhere('u.ingrediente = :ingrediente', { ingrediente: ingrediente.id })
      .getOneOrFail();

    return unidade;
  }

  async findByIngredientAndType(ingrediente: Ingrediente): Promise<Unidade[]> {
    const unidades: Unidade[] = await this.createQueryBuilder('u')
      .innerJoinAndSelect('u.medida', 'm')
      .andWhere('u.ingrediente = :ingrediente', { ingrediente: ingrediente.id })
      .getMany();

    return unidades;
  }

  async findSI(medida: Medida): Promise<Unidade> {
    const unidade: Unidade = await this.createQueryBuilder('u')
      .innerJoinAndSelect('u.medida', 'm')
      .where('u.medida = :medida', { medida: medida.id })
      .andWhere('u.ingrediente is null')
      .getOneOrFail();

    return unidade;
  }

  async findSI2(tipo?: TipoUnidade): Promise<Unidade[]> {
    const unidade: Unidade[] = await this.createQueryBuilder('u')
      .innerJoinAndSelect('u.medida', 'm')
      .where('m.tipoUnidade = :tipo', { tipo: tipo ? tipo : TipoUnidade.UNIDADE })
      .andWhere('u.ingrediente is null')
      .getMany();

    return unidade;
  }
}