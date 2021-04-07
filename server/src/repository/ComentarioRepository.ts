import { EntityRepository, Repository } from 'typeorm';
import { Comentario } from '../entity/Comentario';

@EntityRepository(Comentario)
export class ComentarioRepository extends Repository<Comentario> {

  async findAll(): Promise<Comentario[]> {
    return this.findOrdered('id', true)
  }

  async findOrdered(order: string, ascending: boolean): Promise<Comentario[]> {
    const comentarios: Comentario[] = await this.createQueryBuilder('c')
      .orderBy(order, ascending ? 'ASC' : 'DESC')
      .getMany();

    return comentarios;
  }
  
  async findByReceita(id: number): Promise<Comentario[]> {
    const comentarios: Comentario[] = await this.createQueryBuilder('c')
      .innerJoinAndSelect('c.usuario', 'usuario')
      .leftJoinAndSelect('c.comentarioPai', 'comentarioPai')
      .where('c.receita.id = :id', { id })
      .orderBy('c.data', 'ASC')
      .getMany();

    return comentarios;
  }
}