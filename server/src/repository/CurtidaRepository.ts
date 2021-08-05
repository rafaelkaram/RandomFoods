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
}