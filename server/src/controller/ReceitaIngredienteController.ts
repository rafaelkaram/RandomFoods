import { Request, Response } from 'express';
import { getCustomRepository, Repository, In } from 'typeorm';

import { ReceitaIngredienteRepository } from '../repository/ReceitaIngredienteRepository';

import { Receita } from '../model/Receita';
import { ReceitaIngrediente } from '../model/ReceitaIngrediente';
//import { ReceitaIngredienteDTO } from '../dto/ReceitaIngredienteDTO';

class ReceitaIngredienteController {
    // Métodos internos
    async findMatches(filtro: { gluten: boolean, derivadoLeite: boolean, ids?: number[] }): Promise<ReceitaIngrediente> {
        const repository = getCustomRepository(ReceitaIngredienteRepository);

        const { gluten, derivadoLeite, ids } = filtro as { gluten: boolean, derivadoLeite: boolean, ids: number[] };

        let receitas: number[] | undefined = undefined;
        if (ids) receitas = await repository.findByIngredients(ids);
        else receitas = await repository.findCapeta();

        if (receitas)  {

        }
        ids.forEach(element => {
            teste.push(element);
        });

        console.log(teste);

    }
}

export default ReceitaIngredienteController;