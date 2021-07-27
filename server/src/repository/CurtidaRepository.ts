import { EntityRepository, Repository } from 'typeorm';
import { Curtida } from '../model/Curtida';

@EntityRepository(Curtida)
export class CurtidaRepository extends Repository<Curtida> {
}