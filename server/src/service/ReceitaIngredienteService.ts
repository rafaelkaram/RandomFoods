import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { ReceitaIngredienteRepository } from '../repository/ReceitaIngredienteRepository';

import IngredienteService from './IngredienteService';

import { Ingrediente } from '../entity/Ingrediente';
import { ReceitaIngrediente } from '../entity/ReceitaIngrediente';
import ReceitaService from './ReceitaService';

class ReceitaIngredienteService {
    // Métodos das rotas
    async findPerfectMatch(ids: number[]): Promise<number[]> {
        const repository = getCustomRepository(ReceitaIngredienteRepository);

        const idsReceita = await repository.findByAllIngredients(ids);

        if(!idsReceita) {
            throw 'Nenhuma receita encontrada.';
        }

        return idsReceita;
    }

    // Métodos internos
    async fetch() {

    }

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