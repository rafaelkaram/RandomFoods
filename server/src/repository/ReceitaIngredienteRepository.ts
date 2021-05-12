import { EntityRepository, Repository, Brackets } from 'typeorm';
import { Ingrediente } from '../model/Ingrediente';

import { ReceitaIngrediente } from '../model/ReceitaIngrediente';

@EntityRepository(ReceitaIngrediente)
export class ReceitaIngredienteRepository extends Repository<ReceitaIngrediente> {

  async findByIngredients(ids: number[]): Promise<number[]> {

    const receitas: number[] = await this.createQueryBuilder('ri')
      .select('ri.receita.id', 'id')
      .where('ri.ingrediente IN ( :...ids )', { ids })
      .groupBy('ri.receita.id')
      .getRawMany();

    return receitas;
  }

  async findMatches(isPerfect: boolean, ids: number[], gluten: boolean, derivadoLeite: boolean, categorias: string[]): Promise<{ id: number }[]> {

    const query = this.createQueryBuilder('ri')
      .select('ri.receita.id', 'id')
      .where(' 1 = 1 ');

    if (ids && ids.length > 0)
      query.andWhere('ri.ingrediente IN ( :...ids )', { ids });

    if (gluten || derivadoLeite) {
      query.andWhere(qb => {
        const subQuery = qb.subQuery()
          .select('ri2.receita.id')
          .from(ReceitaIngrediente, 'ri2')
          .from(Ingrediente, 'i')
          .where(' ri2.ingrediente.id = i.id ');
        if (gluten)
          subQuery.andWhere('i.gluten = :gluten')
        if (derivadoLeite)
          subQuery.andWhere('i.derivadoLeite = :derivadoLeite');

        subQuery.groupBy('ri2.receita.id')
          .having('COUNT(ri2.*) = :countZero');

        const sub = subQuery.getQuery();

        return 'ri.receita.id IN (' + sub + ')';
      });

      if (gluten) query.setParameter('gluten', true);
      if (derivadoLeite) query.setParameter('derivadoLeite', true);
      query.setParameter('countZero', 0);

    }

    query.groupBy('ri.receita.id');

    if (isPerfect) query.having('COUNT(ri.*) = :count', { count: ids.length });
    else query.having('COUNT(ri.*) < :count', { count: ids.length });

    query.orderBy('ri.receita.id', 'ASC');

    const receitas = await query.getRawMany();

    return receitas;
  }

  async findByIngredients2(ids: number[], gluten: boolean, derivadoLeite: boolean): Promise<number[]> {
    const query = this.createQueryBuilder('ri')
      .select('ri.receita.id', 'id')
      .where('ri.receita IN ( :...ids )', { ids });

    if (gluten) {
      query.andWhere('ri.ingrediente.gluten = true')
    }

    if (derivadoLeite) {
      query.andWhere('ri.ingrediente.derivadoLeite = true')
    }

    query.groupBy('ri.receita.id')
      .having('COUNT(ri.*) = :count', { count: 0 })
      .orderBy('ri.receita.id', 'ASC');

    return await query.getRawMany();;
  }

  async findWithoutIngredient(gluten: boolean, derivadoLeite: boolean): Promise<number[]> {

    const query = this.createQueryBuilder('ri')
      .select('ri.receita.id', 'id')
      .where('1 = 1');

    if (gluten) {
      query.andWhere('ri.ingrediente.gluten = true')
    }

    if (derivadoLeite) {
      query.andWhere('ri.ingrediente.derivadoLeite = true')
    }

    query.groupBy('ri.receita.id')
      .having('COUNT(ri.*) = :count', { count: 0 })
      .orderBy('ri.receita.id');

    const ids: number[] = await query.getRawMany();

    return ids;
  }

  /*async findMatches(ids: number[]): Promise<number[]> {

    const receitas: number[] = await this.createQueryBuilder('ri')
      .select('ri.receita.id', 'id')
      .innerJoinAndSelect('ri.ingrediente', 'ingrediente', 'ri.ingrediente.id IN ( :...ids )', { ids })
      .getRawMany();

    return receitas;
  }*/

  async findByPartialIngredients(ids: number[]): Promise<number[]>{
    const receitas: number[] = await this.createQueryBuilder('ri')
      .select('ri.receita.id', 'id')
      .where('ri.ingrediente IN ( :...ids )', { ids })
      .groupBy('ri.receita.id')
      .having('COUNT(ri.*) < :count', { count: ids.length })
      .getRawMany();

    return receitas;
  }
}