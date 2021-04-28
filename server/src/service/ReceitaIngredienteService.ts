import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { ReceitaIngredienteRepository } from '../repository/ReceitaIngredienteRepository';

import IngredienteService from './IngredienteService';

import { Ingrediente } from '../entity/Ingrediente';
import { Receita } from '../entity/Receita';
import { ReceitaIngrediente } from '../entity/ReceitaIngrediente';
//import { ReceitaIngredienteDTO } from '../dto/ReceitaIngredienteDTO';

class ReceitaIngredienteService {
    // Métodos internos

    async findPerfectMatch(ids: number[]): Promise<number[]> {
        const repository = getCustomRepository(ReceitaIngredienteRepository);

        const idsReceita = await repository.findByAllIngredients(ids);

        
        if(!idsReceita) {
            throw 'Nenhuma receita encontrada.';
        }

        const idsR = idsReceita.map(item => { return item.id });
        
        return idsR;
    }

    async findPartialMatch(ids: number[]): Promise<number[]> {
        const repository = getCustomRepository(ReceitaIngredienteRepository);

        const idsReceita = await repository.findByPartialIngredients(ids);

        
        if(!idsReceita) {
            throw 'Nenhuma receita encontrada.';
        }

        const idsR = idsReceita.map(item => { return item.id });
        
        return idsR;
    }

    async findReceita(receita: Receita) {
        const repository = getCustomRepository(ReceitaIngredienteRepository);

        const ingredientes = await repository.find({
            relations: [ 'ingrediente', 'unidade' ],
            where: {
                receita,
            },
        });

        return ingredientes;
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