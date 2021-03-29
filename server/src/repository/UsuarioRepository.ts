import { EntityRepository, Repository } from 'typeorm';
import { Usuario } from '../entity/Usuario';

@EntityRepository(Usuario)
export class UsuarioRepository extends Repository<Usuario> {

  async findAll(): Promise<Usuario[]> {
    return this.findOrdered('id', true)
  }

  async findOrdered(order: string, ascending: boolean): Promise<Usuario[]> {
    const usuarios: Usuario[] = await this.createQueryBuilder('usuario')
      .where('ativo = :ativo', { ativo: true })
      .orderBy(order, ascending ? 'ASC' : 'DESC')
      .getMany();

    return usuarios;
  }

}