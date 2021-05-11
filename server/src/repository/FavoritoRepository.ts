import { EntityRepository, Repository } from 'typeorm';
import { Favorito } from '../model/Favorito';

@EntityRepository(Favorito)
export class FavoritoRepository extends Repository<Favorito> {
}