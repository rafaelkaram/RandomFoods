import { EntityRepository, Repository } from 'typeorm';
import { Categoria } from '../model/Categoria';

@EntityRepository(Categoria)
export class CategoriaRepository extends Repository<Categoria> {

  async countCategoryByUserId(id: number): Promise<{ categoria: string, count: number }[]> {
    const categorias = await this.createQueryBuilder('c')
      .innerJoin('c.receita', 'r')
      .select('c.nome', 'categoria')
      .addSelect('COUNT(c.*)', 'count')
      .where('r.usuario.id = :id', { id })
      .groupBy('c.nome')
      .getRawMany();

    return categorias;
  }
}