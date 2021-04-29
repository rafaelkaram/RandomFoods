import { EntityRepository, Repository } from 'typeorm';

import { Receita } from '../entity/Receita';
import { Usuario } from '../model/Usuario';

@EntityRepository(Receita)
export class ReceitaRepository extends Repository<Receita> {

  async countTypeByUserId(id: number): Promise<any> {
    const tipoReceita = await this.createQueryBuilder('r')
      .select('r.tipo', 'tipo')
      .addSelect('COUNT(r.*)', 'count')
      .where('r.usuario.id = :id', { id })
      .groupBy('r.tipo')
      .getRawMany();

    return tipoReceita;
  }

  async findByNameAndUser(nome: string, usuario: Usuario): Promise<Receita>{
    const receita: Receita = await this.createQueryBuilder('r')
      .where('r.usuario = :usuario', { usuario })
      .andWhere('r.nome = :nome', { nome })
      .getOneOrFail();

    return receita;
  }

  async findByFiltro(ids: number[]): Promise<Receita[]>{
    const receitas = await this.createQueryBuilder('r')
      .leftJoinAndSelect('r.midias', 'midias')
      .where('r.id in (:...ids)', { ids })
      .getMany();

    return receitas;
  }
}