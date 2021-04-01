import { EntityRepository, Repository } from 'typeorm';

import { Avaliacao } from '../entity/Avaliacao';

@EntityRepository(Avaliacao)
export class AvaliacaoRepository extends Repository<Avaliacao> {

  async findAll(): Promise<Avaliacao[]> {
    return this.findOrdered('id', true)
  }

  async findOrdered(order: string, ascending: boolean): Promise<Avaliacao[]> {
    const avaliacoes: Avaliacao[] = await this.createQueryBuilder('avaliacao')
      .orderBy(order, ascending ? 'ASC' : 'DESC')
      .getMany();

    return avaliacoes;
  }

  async findByReceita(id: number, offset: number): Promise<Avaliacao[]> {
    const avaliacoes = this.createQueryBuilder('avaliacao')
      .where('id_receita = :id', { id: id })
      .offset((offset - 1) * 5)
      .limit(5)
      .getMany();

    return avaliacoes;
  }

  async findByUserId(id: number): Promise<any[]> {
    const avaliacoes = await this.createQueryBuilder('a')
      .innerJoin('a.receita', 'r')
      .select('r.id', 'id')
      .addSelect('r.nome', 'nome')
      .addSelect('AVG(a.nota)', 'nota')
      .addSelect('COUNT(a.*)', 'qtdeNotas')
      .where('r.usuario.id = :id', { id })
      .groupBy('r.id')
      .addGroupBy('r.nome')
      .getRawMany();

    return avaliacoes;
  }

  async findByReceitaId(id: number): Promise<{ nota: number, qtdeNotas: number }> {
    const avaliacoes = await this.createQueryBuilder('a')
      .select('AVG(a.nota)', 'nota')
      .addSelect('COUNT(a.*)', 'qtdeNotas')
      .where('a.receita.id = :id', { id })
      .getRawOne();

    return avaliacoes;
  }
}