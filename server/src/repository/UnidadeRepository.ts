import { Brackets, EntityRepository, Repository } from 'typeorm';

import IngredienteService from '../service/IngredienteService';

import { Ingrediente } from '../entity/Ingrediente';
import { TipoUnidade } from '../entity/TipoUnidade';
import { Unidade } from '../entity/Unidade';

@EntityRepository(Unidade)
export class UnidadeRepository extends Repository<Unidade> {

  async findAll(): Promise<Unidade[]> {
    return this.findOrdered('id', true)
  }

  async findOrdered(order: string, ascending: boolean): Promise<Unidade[]> {
    const unidades: Unidade[] = await this.createQueryBuilder()
      .orderBy(order, ascending ? 'ASC' : 'DESC')
      .getMany();

    return unidades;
  }

  async findWithIngrediente(): Promise<Unidade[]> {
    const unidades: Unidade[] = await this.find({ relations: [ 'ingrediente' ], order: { id: 'ASC' } });

    return unidades;
  }

  async findBySigla(nome: string, tiposUnidade: TipoUnidade[]): Promise<Unidade> {
    console.log(tiposUnidade);

    const unidade: Unidade = await this.createQueryBuilder('u')
      .where('u.tipo IN (:...tiposUnidade)', { tiposUnidade })
      .andWhere(new Brackets(qb => {
        qb.where('LOWER(u.sigla) = LOWER(:sigla)', { sigla: nome } )
          .orWhere('LOWER(u.nome) = LOWER(:nome)', { nome })
      }))
      .getOneOrFail();

    return unidade;
  }

  async findByIngrediente(nome: string, id: number): Promise<Unidade> {
    const unidade: Unidade = await this.createQueryBuilder('u')
      .where('LOWER(u.sigla) = LOWER(:nome)', { nome })
      .andWhere('u.ingrediente = :ingrediente', { ingrediente: id })
      .getOneOrFail();

    return unidade;
  }

  async getIngrediente(id: number): Promise<Ingrediente> {
    const ingredienteService = new IngredienteService();
    const ingrediente = await ingredienteService.findById(id);

    return ingrediente;
  }

}