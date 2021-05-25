import { EntityRepository, Repository, Brackets } from 'typeorm';
import { Ingrediente } from '../model/Ingrediente';
import { Receita } from '../model/Receita';

import { ReceitaIngrediente } from '../model/ReceitaIngrediente';

@EntityRepository(ReceitaIngrediente)
export class ReceitaIngredienteRepository extends Repository<ReceitaIngrediente> {
	// Métodos internos
	async findMatches(isPerfect: boolean, ids: number[], tempoPreparo: number, gluten: boolean, derivadoLeite: boolean, categorias: string[]): Promise<{ id: number }[]> {

		const query = this.createQueryBuilder('ri')
		.select('ri.receita.id', 'id')
		.where('ri.receita.ativo = :ativo ', { ativo: true });

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

		if (tempoPreparo !== 0) {
			query.andWhere(qb => {
				const subQuery = qb.subQuery()
				.select('r.id')
				.from(Receita, 'r')
				.where(' r.tempoPreparo = :tempoPreparo ');

				const sub = subQuery.getQuery();

				return 'ri.receita.id IN (' + sub + ')';
			});

			query.setParameter('tempoPreparo', tempoPreparo);
		}

		query.groupBy('ri.receita.id');

		if (isPerfect) query.having('COUNT(ri.*) = :count', { count: ids.length });
		else query.having('COUNT(ri.*) < :count', { count: ids.length });

		query.orderBy('ri.receita.id', 'ASC');

		const receitas = await query.getRawMany();

		return receitas;
	}
}