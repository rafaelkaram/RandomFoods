import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { ReceitaIngredienteRepository } from '../repository/ReceitaIngredienteRepository';

import { Receita } from '../model/Receita';
import { ReceitaIngrediente } from '../model/ReceitaIngrediente';
//import { ReceitaIngredienteDTO } from '../dto/ReceitaIngredienteDTO';

class ReceitaIngredienteController {
    // Métodos internos
    async insertByRecipe(item: ReceitaIngrediente): Promise<ReceitaIngrediente> {
        const { quantidade, unidade, ingrediente, receita } = item;

        const receitaIngrediente = new ReceitaIngrediente(ingrediente, receita, quantidade);

        await receitaIngrediente.save();

        return receitaIngrediente;
    }
}

export default ReceitaIngredienteController;