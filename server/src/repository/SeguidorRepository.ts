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
			.innerJoinAndSelect('s.usuario', 'u')
			.where('s.seguidor = :id', { id })
			.getMany();

		return seguidor;
	}

	async findSeguidorByUsuario(id: Number): Promise<Seguidor[]> {
		const seguidor: Seguidor[] = await this.createQueryBuilder('s')
			.innerJoinAndSelect('s.seguidor', 'se')
			.where('s.usuario = :id', { id })
			.getMany();

		return seguidor;
	}

	async findPorSeguidos(id: Number): Promise<{ id: number }[]> {
		const receitas: { id: number }[] = await this.createQueryBuilder('s')
			.innerJoin('receita', 'r', 'r.usuario = s.usuario')
      .select('r.id', 'id')
			.where('s.seguidor = :id', { id })
			.andWhere('r.ativa = :ativa', { ativa: true })
      .getRawMany();

		return receitas;
	}
}