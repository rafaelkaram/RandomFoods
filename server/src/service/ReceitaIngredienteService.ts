import { getCustomRepository } from 'typeorm';

import { ReceitaIngredienteRepository } from '../repository/ReceitaIngredienteRepository';

import { ReceitaIngrediente } from '../entity/ReceitaIngrediente';

class ReceitaIngredienteService {
    // Métodos internos
    async insertByRecipe(item: ReceitaIngrediente): Promise<ReceitaIngrediente> {
        const repository = getCustomRepository(ReceitaIngredienteRepository);

        const { quantidade, unidade, ingrediente, receita } = item;

        const receitaIngrediente = repository.create({
            quantidade,
            unidade,
            ingrediente,
            receita
        });

        await repository.save(receitaIngrediente);

        return receitaIngrediente;
    }
}

export default ReceitaIngredienteService;