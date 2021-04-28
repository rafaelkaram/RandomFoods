import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { ReceitaIngredienteRepository } from '../repository/ReceitaIngredienteRepository';

import { Receita } from '../entity/Receita';
import { ReceitaIngrediente } from '../entity/ReceitaIngrediente';
//import { ReceitaIngredienteDTO } from '../dto/ReceitaIngredienteDTO';

class ReceitaIngredienteController {
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

export default ReceitaIngredienteController;