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
    const ingredientes: Ingrediente[] = await this.createQueryBuilder('i')
      .where('i.id IN (:...ids)', { ids })
      .orderBy(order, ascending ? 'ASC' : 'DESC')
      .getMany();

    return ingredientes;
  }

  async findByNome(nome: string): Promise<Ingrediente> {
    const ingrediente: Ingrediente = await this.createQueryBuilder('i')
      .where('LOWER(i.nome) = :nome', { nome: nome.toLowerCase() })
      .getOne();

    return ingrediente;
  }
}