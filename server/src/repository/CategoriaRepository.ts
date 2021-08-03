import { EntityRepository, Repository } from 'typeorm';
import { Categoria } from '../model/Categoria';

@EntityRepository(Categoria)
export class CategoriaRepository extends Repository<Categoria> {

  async countCategoryByUserId(id: number): Promise<{ categoria: string, count: number }[]> {
		const categorias = await this.createQueryBuilder('c')
			.leftJoin('c.receita', 'r')
			.select('c.nome', 'categoria')
			.addSelect('COUNT(c.*)', 'count')
			.where('r.usuario.id = :id', { id })
			.groupBy('c.nome')
			.orderBy('COUNT(c.*)', 'DESC')
			.addOrderBy('c.nome', 'ASC')
			.getRawMany();

		return categorias;
  }

  async findByCategoryAndUserId(id: number, categoria: string): Promise<{ receita: number }[]> {
		const categorias = await this.createQueryBuilder('c')
			.leftJoin('c.receita', 'r')
			.select('r.id', 'receita')
			.where('r.usuario.id = :id', { id })
			.andWhere('c.nome = :categoria', { categoria })
			.getRawMany();

		return categorias;
  }
}