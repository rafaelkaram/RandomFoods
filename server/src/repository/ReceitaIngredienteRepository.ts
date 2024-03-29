import { EntityRepository, Repository } from 'typeorm';
import { Categoria } from '../model/Categoria';
import { Ingrediente } from '../model/Ingrediente';
import { Receita } from '../model/Receita';

import { ReceitaIngrediente } from '../model/ReceitaIngrediente';

@EntityRepository(ReceitaIngrediente)
export class ReceitaIngredienteRepository extends Repository<ReceitaIngrediente> {
	async findMatches(isPerfect: boolean, ids: number[], tempoPreparo: number, gluten: boolean, derivadoLeite: boolean, categorias: string[], porcoes: number, tipo?: string[]): Promise<{ id: number }[]> {

		const query = this.createQueryBuilder('ri')
			.select('ri.receita.id', 'id')
			.innerJoin('ri.receita', 'r')
			.where('r.ativa = :ativa ', { ativa: true });

		if (ids && ids.length > 0)
			query.andWhere('ri.ingrediente IN ( :...ids )', { ids });

		if (tipo && tipo.length > 0)
			query.andWhere('r.tipo IN ( :...tipo )', { tipo });

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
				.select('r2.id')
				.from(Receita, 'r2')
				.where(' r2.tempoPreparo <= :tempoPreparo ');

				const sub = subQuery.getQuery();

				return 'ri.receita.id IN (' + sub + ')';
			});

			query.setParameter('tempoPreparo', tempoPreparo);
		}

		if (categorias && categorias.length > 0) {
			query.andWhere(qb => {
				const subQuery = qb.subQuery()
				.select('c.receita.id')
				.from(Categoria, 'c')
				.where(' c.nome IN ( :...categorias ) ', { categorias });

				const sub = subQuery.getQuery();

				return 'ri.receita.id IN (' + sub + ')';
			});

			query.setParameter('tempoPreparo', tempoPreparo);
		}

		if (porcoes !== 0) {
			query.andWhere(qb => {
				const subQuery = qb.subQuery()
				.select('r2.id')
				.from(Receita, 'r2')
				.where(' r2.porcoes <= :porcoes ');

				const sub = subQuery.getQuery();

				return 'ri.receita.id IN (' + sub + ')';
			});

			query.setParameter('porcoes', porcoes);
		}

		query.groupBy('ri.receita.id');

		if (isPerfect) query.having('COUNT(ri.*) = :count', { count: ids.length });
		else query.having('COUNT(ri.*) < :count', { count: ids.length });

		query.orderBy('COUNT(ri.*)', 'ASC');

		const receitas = await query.getRawMany();

		return receitas;
	}
}