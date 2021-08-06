import { EntityRepository, Repository } from 'typeorm';
import { Curtida } from '../model/Curtida';

@EntityRepository(Curtida)
export class CurtidaRepository extends Repository<Curtida> {
  async findPorCurtida(): Promise<{ id: number }[]> {
    const receitas: { id: number }[] = await this.createQueryBuilder('c')
      .select('c.receita', 'id')
      .groupBy('c.receita')
      .orderBy('COUNT(c.*)', 'DESC')
      .getRawMany();

    return receitas;
  }

	async findTopCurtidas(id: number): Promise<any[]> {
		const curtidas = await this.createQueryBuilder('c')
      .innerJoin('c.receita', 'r', 'r.id = c.receita')
      .select('r.id', 'id')
      .addSelect('r.nome', 'nome')
      .addSelect('COUNT(c.*)', 'curtidas')
      .where('r.usuario.id = :id', { id })
      .groupBy('r.id')
      .addGroupBy('r.nome')
      .orderBy('COUNT(c.*)', 'DESC')
      .limit(5)
      .getRawMany();

		return curtidas;
	}
}