import { EntityRepository, Repository } from 'typeorm';

import { Medida } from '../model/Medida';

@EntityRepository(Medida)
export class MedidaRepository extends Repository<Medida> {

  async findAll(): Promise<Medida[]> {
    return this.findOrdered('id', true)
  }

  async findOrdered(order: string, ascending: boolean): Promise<Medida[]> {
    const medidas: Medida[] = await this.createQueryBuilder('m')
      .orderBy(order, ascending ? 'ASC' : 'DESC')
      .getMany();

    return medidas;
  }

  async findByIngredient(sigla: string, ingrediente: string): Promise<Medida> {
    const medida: any = this.createQueryBuilder()
      .where('LOWER(ingrediente.nome) = :ingrediente', { ingrediente })
      .andWhere('LOWER(sigla) = :sigla', { sigla })
      .getOne();

    return medida;
  }

  async findBySigla(sigla: string): Promise<Medida> {
    const medida: any = this.createQueryBuilder()
      .where('ingrediente is null')
      .andWhere('LOWER(sigla) = :sigla', { sigla })
      .getOne();

    return medida;
  }
}