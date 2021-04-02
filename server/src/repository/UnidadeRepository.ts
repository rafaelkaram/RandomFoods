import { Brackets, EntityRepository, Repository } from 'typeorm';

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
    const unidade: Unidade = await this.createQueryBuilder('u')
      .where('u.tipo IN (:...tiposUnidade)', { tiposUnidade })
      .andWhere(new Brackets(qb => {
        qb.where('LOWER(u.sigla) = :sigla', { sigla: nome.toLowerCase() } )
          .orWhere('LOWER(u.nome) = :nome', { nome: nome.toLowerCase() })
      }))
      .getOneOrFail();

    return unidade;
  }

  async findByIngrediente(nome: string, id: number): Promise<Unidade> {
    const unidade: Unidade = await this.createQueryBuilder('u')
      .where('LOWER(u.sigla) = :nome', { nome: nome.toLowerCase() })
      .andWhere('u.ingrediente = :ingrediente', { ingrediente: id })
      .getOneOrFail();

    return unidade;
  }
}