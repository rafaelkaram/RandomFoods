import { EntityRepository, Repository } from 'typeorm';
import { Marca } from '../model/Marca';

@EntityRepository(Marca)
export class MarcaRepository extends Repository<Marca> {
}