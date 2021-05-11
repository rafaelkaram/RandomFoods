import { EntityRepository, Repository, Brackets } from 'typeorm';

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
      .having('COUNT(ri.*) = :count', { count: 0 });

    await query.getRawMany();

    return query;
  }

  async findMatches(ids: number[]): Promise<number[]> {

    const receitas: number[] = await this.createQueryBuilder('ri')
      .select('ri.receita.id', 'id')
      .innerJoinAndSelect('ri.ingrediente', 'ingrediente', 'ri.ingrediente.id IN ( :...ids )', { ids })
      .getRawMany();

    return receitas;
  }

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