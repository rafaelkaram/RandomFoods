import { EntityRepository, Repository, Brackets } from 'typeorm';

import { ReceitaIngrediente } from '../entity/ReceitaIngrediente';

@EntityRepository(ReceitaIngrediente)
export class ReceitaIngredienteRepository extends Repository<ReceitaIngrediente> {

  async findByAllIngredients(ids: number[], dl: string, gl: string): Promise<number[]> {

    const derivadoLeite = (dl == 'false')
    const gluten = (gl == 'false')

    const receitas: number[] = await this.createQueryBuilder('ri')
      .select('ri.receita.id', 'id')
      .where('ri.ingrediente IN ( :...ids )', { ids })
      .groupBy('ri.receita.id')
      .having('COUNT(ri.*) = :count', { count: ids.length })
      .getRawMany();

    if (receitas.length > 0) {

      const idsR = receitas.map(item => { return item.id });

      if ((!derivadoLeite && !gluten)) {
        return idsR;
      }

      const query = this.createQueryBuilder('ri')
        .select('ri.receita.id', 'id')
        .innerJoin('ri.ingrediente', 'i')
        .where('ri.receita.id IN ( :...idsR )', { idsR })

      if (derivadoLeite || gluten) {
        query.andWhere(new Brackets(qb => {

          if (derivadoLeite && gluten) {
            qb.where('i.derivadoLeite = :dL ', { dL: true })
              .orWhere('i.gluten = :gL ', { gL: true })
          }

          if (derivadoLeite && !gluten) {
            qb.where('i.derivadoLeite = :dL ', { dL: true })
          }

          if (gluten && !derivadoLeite) {
            qb.where('i.gluten = :gL ', { gL: true })
          }
        }))
      }

      query.groupBy('ri.receita.id')
      query.having('COUNT(ri.*) > 0')

      const r = await query.getRawMany();

      const r2 = r.map(item => { return item.id });

      if (r2.length > 0) {
        const recipes: number[] = idsR.map(item => {
          if (!r2.includes(item)) {
            return (
              item
            )
          }
          return 0;
        })

        return recipes;
      }
    }
    return [];
  }





  async findByPartialIngredients(ids: number[], dl: string, gl: string): Promise<number[]> {

    const derivadoLeite = (dl == 'false')
    const gluten = (gl == 'false')

    const receitas: number[] = await this.createQueryBuilder('ri')
      .select('ri.receita.id', 'id')
      .where('ri.ingrediente IN ( :...ids )', { ids })
      .groupBy('ri.receita.id')
      .having('COUNT(ri.*) < :count', { count: ids.length })
      .getRawMany();

    if (receitas.length > 0) {

      const idsR = receitas.map(item => { return item.id });

      if ((!derivadoLeite && !gluten)) {
        return idsR;
      }

      const query = this.createQueryBuilder('ri')
        .select('ri.receita.id', 'id')
        .innerJoin('ri.ingrediente', 'i')
        .where('ri.receita.id IN ( :...idsR )', { idsR })

      if (derivadoLeite || gluten) {
        query.andWhere(new Brackets(qb => {

          if (derivadoLeite && gluten) {
            qb.where('i.derivadoLeite = :dL ', { dL: true })
              .orWhere('i.gluten = :gL ', { gL: true })
          }

          if (derivadoLeite && !gluten) {
            qb.where('i.derivadoLeite = :dL ', { dL: true })
          }

          if (gluten && !derivadoLeite) {
            qb.where('i.gluten = :gL ', { gL: true })
          }
        }))
      }

      query.groupBy('ri.receita.id')
      query.having('COUNT(ri.*) > 0')

      const r = await query.getRawMany();

      const r2 = r.map(item => { return item.id });

      if (r2.length > 0) {
        const recipes: number[] = idsR.map(item => {
          if (!r2.includes(item)) {
            return (
              item
            )
          }
          return 0;
        })

        return recipes;
      }
    }
    return [];
  }
}