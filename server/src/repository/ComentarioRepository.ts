import { EntityRepository, Repository } from 'typeorm';
import { Comentario } from '../entity/Comentario';

@EntityRepository(Comentario)
export class ComentarioRepository extends Repository<Comentario> {

  async findAll(): Promise<Comentario[]> {
    return this.findOrdered('id', true)
  }

  async findOrdered(order: string, ascending: boolean): Promise<Comentario[]> {
    const comentarios: Comentario[] = await this.createQueryBuilder('comentario')
      .orderBy(order, ascending ? 'ASC' : 'DESC')
      .getMany();

    return comentarios;
  }
}