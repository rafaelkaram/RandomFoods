import { EntityRepository, Repository } from 'typeorm';
import { ReceitaIngrediente } from '../entity/ReceitaIngrediente';

@EntityRepository(ReceitaIngrediente)
export class ReceitaIngredienteRepository extends Repository<ReceitaIngrediente> {

}