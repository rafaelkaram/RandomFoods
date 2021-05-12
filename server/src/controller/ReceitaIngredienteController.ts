import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { ReceitaIngredienteRepository } from '../repository/ReceitaIngredienteRepository';

import { Receita } from '../model/Receita';
import { ReceitaIngrediente } from '../model/ReceitaIngrediente';
//import { ReceitaIngredienteDTO } from '../dto/ReceitaIngredienteDTO';

class ReceitaIngredienteController {
    // Métodos internos
    async findReceita(receita: Receita): Promise<ReceitaIngrediente[]> {
        const repository = getCustomRepository(ReceitaIngredienteRepository);

        const ingredientes = await repository.find({
            relations: [ 'ingrediente', 'unidade' ],
            where: {
                receita,
            },
        });

        return ingredientes;
    }

    async findMatches(filtro: { gluten: boolean, derivadoLeite: boolean, ids?: number[], categorias?: string[] }): Promise<{ perfect: number[], partial: number[] }> {
        const repository = getCustomRepository(ReceitaIngredienteRepository);

        const { gluten, derivadoLeite, ids, categorias } = filtro as { gluten: boolean, derivadoLeite: boolean, ids: number[], categorias: string[] };

        const perfect = await repository.findMatches(true, ids, gluten, derivadoLeite, categorias);
        const partial = await repository.findMatches(false, ids, gluten, derivadoLeite, categorias);

        const receitas = {
            perfect: perfect.map(obj => { return obj.id }),
            partial: partial.map(obj => { return obj.id }),
        }

        return receitas;
    }
}

export default ReceitaIngredienteController;