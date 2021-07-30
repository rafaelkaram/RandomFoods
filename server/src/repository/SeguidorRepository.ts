import { EntityRepository, Repository } from 'typeorm';
import { Seguidor } from '../model/Seguidor';

@EntityRepository(Seguidor)
export class SeguidorRepository extends Repository<Seguidor> {

	async findAll(): Promise<Seguidor[]> {
		return this.findOrdered('id', true);
	}

	async findOrdered(order: string, ascending: boolean): Promise<Seguidor[]> {
		const seguidores: Seguidor[] = await this.createQueryBuilder('c')
			.orderBy(order, ascending ? 'ASC' : 'DESC')
			.getMany();

		return seguidores;
	}

  async findByUsuario(id: Number): Promise<Seguidor[]> {
    const seguidor: Seguidor[] = await this.createQueryBuilder('s')
	  .innerJoinAndSelect('s.seguidor', 'se')
	  .select(['se.id', 'se.nome',  's.id'])
      .where('s.usuario = :id', { id })
	  .getMany();

    return seguidor;
  }
}