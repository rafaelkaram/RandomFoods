import { EntityRepository, Repository } from 'typeorm';

import { ReceitaIngrediente } from '../entity/ReceitaIngrediente';

@EntityRepository(ReceitaIngrediente)
export class ReceitaIngredienteRepository extends Repository<ReceitaIngrediente> {

  async findByAllIngredients(ids: number[]): Promise<number[]> {
    const receitas: number[] = await this.createQueryBuilder('ri')
      .select('ri.receita.id', 'id')
      .where('ri.ingrediente IN ( :...ids )', { ids })
      .groupBy('ri.receita.id')
      .having('COUNT(ri.*) = :count', { count: ids.length })
      .getRawMany();

    return receitas;
  }
}