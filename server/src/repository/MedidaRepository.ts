import { EntityRepository, Repository } from 'typeorm';

import { Medida } from '../model/Medida';
import { TipoUnidade } from '../model/TipoUnidade';

@EntityRepository(Medida)
export class MedidaRepository extends Repository<Medida> {

	async findAll(): Promise<Medida[]> {
		return this.findOrdered('id', true)
	}

	async findOrdered(order: string, ascending: boolean): Promise<Medida[]> {
		const medidas: Medida[] = await this.createQueryBuilder('m')
			.orderBy(order, ascending ? 'ASC' : 'DESC')
			.getMany();

		return medidas;
	}

	async findByType(nome: string, tipo: TipoUnidade): Promise<Medida> {
		const medida: any = this.createQueryBuilder()
			.where('tipo_unidade = :tipo', { tipo })
			.andWhere('LOWER(nome) = :nome', { nome })
			.getOneOrFail();

		return medida;
	}

	async findByName(nome: string): Promise<Medida> {
		const medida: any = this.createQueryBuilder()
			.where('ingrediente is null')
			.andWhere('LOWER(nome) = :nome', { nome })
			.getOneOrFail();

		return medida;
	}
}