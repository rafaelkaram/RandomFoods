import { EntityRepository, Repository } from 'typeorm';

import { Usuario } from '../model/Usuario';

@EntityRepository(Usuario)
export class UsuarioRepository extends Repository<Usuario> {

	async findAll(): Promise<Usuario[]> {
		return this.findOrdered('id', true)
	}

	async findOrdered(order: string, ascending: boolean): Promise<Usuario[]> {
		const usuarios: Usuario[] = await this.createQueryBuilder('u')
		.where('u.ativo = :ativo', { ativo: true })
		.orderBy(order, ascending ? 'ASC' : 'DESC')
		.getMany();

		return usuarios;
	}

	async findByLoginOrEmail(data: string): Promise<Usuario> {
		const usuario: Usuario = await this.createQueryBuilder('u')
		.where('u.ativo = :ativo', { ativo: true })
		.andWhere('LOWER(u.email) = :email OR LOWER(u.login) = :login', { email: data, login: data })
		.getOneOrFail();

		return usuario;
	}

}