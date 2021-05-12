import { EntityRepository, Repository } from 'typeorm';
import { LogNotificacao } from '../model/LogNotificacao';

@EntityRepository(LogNotificacao)
export class LogNotificacaoRepository extends Repository<LogNotificacao> {

  async findAll(): Promise<LogNotificacao[]> {
    return this.findOrdered('id', true)
  }

  async findOrdered(order: string, ascending: boolean): Promise<LogNotificacao[]> {
    const logsNotificacao: LogNotificacao[] = await this.createQueryBuilder('logsNotificacao')
      .orderBy(order, ascending ? 'ASC' : 'DESC')
      .getMany();

    return logsNotificacao;
  }

  async countNotRead(id: number): Promise<number> {
    const qtde: number = await this.createQueryBuilder('l')
      .where('l.usuario = :id', { id })
      .andWhere('l.visualizada = :isVisualizado', { isVisualizado: true })
      .getCount();

    return qtde;
  }

}