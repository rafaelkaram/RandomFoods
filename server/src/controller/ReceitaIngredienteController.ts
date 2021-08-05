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
            relations: [ 'ingrediente', 'unidade', 'unidade.medida' ],
            where: {
                receita,
            },
        });

        return ingredientes;
    }

    async findMatches(filtro: { tempoPreparo: number, gluten: boolean, derivadoLeite: boolean, ids?: number[], categorias?: string[], porcoes?: number, tipo?: string[] }): Promise<{ perfect: number[], partial: number[] }> {
        const repository = getCustomRepository(ReceitaIngredienteRepository);

        const { tempoPreparo, gluten, derivadoLeite, ids, categorias, porcoes, tipo } = filtro as { tempoPreparo: number, gluten: boolean, derivadoLeite: boolean, ids: number[], categorias: string[], porcoes?: number, tipo?: string[] };

        const perfect = await repository.findMatches(true, ids, tempoPreparo, gluten, derivadoLeite, categorias, porcoes ? porcoes : 0, tipo);
        const partial = await repository.findMatches(false, ids, tempoPreparo, gluten, derivadoLeite, categorias, porcoes ? porcoes : 0, tipo);

        const receitas = {
            perfect: perfect.map(obj => { return obj.id }),
            partial: partial.map(obj => { return obj.id }),
        }

        return receitas;
    }
}

export default ReceitaIngredienteController;