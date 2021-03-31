import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { ReceitaIngredienteRepository } from '../repository/ReceitaIngredienteRepository';

import IngredienteService from './IngredienteService';

import { Ingrediente } from '../entity/Ingrediente';
import { ReceitaIngrediente } from '../entity/ReceitaIngrediente';
import ReceitaService from './ReceitaService';

class ReceitaIngredienteService {
    // Métodos das rotas
    async findPerfectMatch(request: Request, response: Response) {
        const repository = getCustomRepository(ReceitaIngredienteRepository);

        const { ids } = request.query;

        try {
            const receitaService = new ReceitaService();

            const idsReceita = await repository.findByAllIngredients(ids);
            const receitas = await receitaService.findByIds(idsReceita);

            return response.status(200).json(receitas);
        } catch (e) {
            console.error(e);
            response.status(400).json({ error: e });
        }
    }

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