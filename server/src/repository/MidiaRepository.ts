import { EntityRepository, Repository } from 'typeorm';
import { Midia } from '../model/Midia';

@EntityRepository(Midia)
export class MidiaRepository extends Repository<Midia> {

  async findAll(): Promise<Midia[]> {
    return this.findOrdered('id', true)
  }

  async findOrdered(order: string, ascending: boolean): Promise<Midia[]> {
    const midias: Midia[] = await this.createQueryBuilder('midia')
      .orderBy(order, ascending ? 'ASC' : 'DESC')
      .getMany();

    return midias;
  }

  async findByReceita(id: number): Promise<Midia[]> {
    const midias: Midia[] = await this.createQueryBuilder('m')
      .where('m.receita.id = :id', { id })
      .orderBy('m.dataCadastro', 'DESC')
      .getMany();

    return midias;
  }

}