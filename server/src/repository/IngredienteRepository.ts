import { EntityRepository, Repository } from 'typeorm';
import { Ingrediente } from '../model/Ingrediente';

@EntityRepository(Ingrediente)
export class IngredienteRepository extends Repository<Ingrediente> {

	async findAll(): Promise<Ingrediente[]> {
		return this.findOrdered('id', true)
	}

	async findOrdered(order: string, ascending: boolean): Promise<Ingrediente[]> {
		const ingredientes: Ingrediente[] = await this.createQueryBuilder('ingrediente')
			.orderBy(order, ascending ? 'ASC' : 'DESC')
			.getMany();

		return ingredientes;
	}

	async findByIds(ids: number[]): Promise<Ingrediente[]> {
		return this.findByIdsOrdered(ids,'nome', true);
	}

  	async findByIdsOrdered(ids: number[], order: string, ascending: boolean): Promise<Ingrediente[]> {
		const ingredientes: Ingrediente[] = await this.createQueryBuilder('i')
			.where('i.id IN (:...ids)', { ids })
			.orderBy(order, ascending ? 'ASC' : 'DESC')
			.getMany();

		return ingredientes;
	}

	async findByIdsAndType(ids: number[], tipo: string): Promise<Ingrediente[]> {
		const ingredientes: Ingrediente[] = await this.createQueryBuilder('i')
			.where('i.id IN (:...ids)', { ids })
			.andWhere('i.tipoIngrediente = :tipo', { tipo })
			.orderBy('i.tipoIngrediente', 'ASC')
			.addOrderBy('i.nome', 'ASC')
			.getMany();

		return ingredientes;
	}

	async findByName(nome: string): Promise<Ingrediente> {
		const ingrediente: any = await this.createQueryBuilder('i')
			.where('LOWER(i.nome) = :nome', { nome })
			.getOneOrFail();

		return ingrediente;
	}
}