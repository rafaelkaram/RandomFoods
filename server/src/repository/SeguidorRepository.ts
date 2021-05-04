import { EntityRepository, Repository } from 'typeorm';
import { Seguidor } from '../model/Seguidor';

@EntityRepository(Seguidor)
export class SeguidorRepository extends Repository<Seguidor> {
}