import { EntityRepository, Repository } from 'typeorm';
import { Ingrediente } from '../entity/Ingrediente';

@EntityRepository(Ingrediente)
export class IngredienteRepository extends Repository<Ingrediente> {

  async findAll(): Promise<Ingrediente[]> {
    return this.findOrdered('id', true)
  }

  async findOrdered(order: string, ascending: boolean): Promise<Ingrediente[]> {
    const ingredientes: Ingrediente[] = await this.createQueryBuilder('ingrediente')
      .orderBy(order, ascending ? 'ASC' : 'DESC')
      .getMany();

    return ingredientes;
  }

  async findByIds(ids: number[]): Promise<Ingrediente[]> {
    return this.findByIdsOrdered(ids,'nome', true);
  }

  async findByIdsOrdered(ids: number[], order: string, ascending: boolean): Promise<Ingrediente[]> {
    const ingredientes: Ingrediente[] = await this.createQueryBuilder('ingrediente')
      .whereInIds(ids)
      .orderBy(order, ascending ? 'ASC' : 'DESC')
      .getMany();

    return ingredientes;
  }
}