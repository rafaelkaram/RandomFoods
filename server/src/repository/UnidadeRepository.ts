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
      .where('u.ingrediente IN (:...ingredientes)', { ingredientes })
      .andWhere('u.medida = :medida', { medida })
      .getOneOrFail();

    return unidade;
  }

  async findByIngredient(medida: Medida, ingrediente: Ingrediente): Promise<Unidade> {
    const unidade: Unidade = await this.createQueryBuilder('u')
      .where('u.medida = :medida', { medida })
      .andWhere('u.ingrediente = :ingrediente', { ingrediente })
      .getOneOrFail();

    return unidade;
  }

  async findSI(medida: Medida): Promise<Unidade> {
    const unidade: Unidade = await this.createQueryBuilder('u')
      .where('u.medida = :medida', { medida })
      .andWhere('u.ingrediente is null')
      .getOneOrFail();

    return unidade;
  }

  async findUnidade(): Promise<Unidade> {
    const unidade: Unidade = await this.createQueryBuilder('u')
      .where('u.medida.tipoUnidade = :tipo', { tipo: TipoUnidade.UNIDADE })
      .andWhere('u.ingrediente is null')
      .getOneOrFail();

    return unidade;
}
}