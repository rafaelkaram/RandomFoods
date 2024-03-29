import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { UnidadeRepository } from '../repository/UnidadeRepository';

import IngredienteController from './IngredienteController';
import MedidaController from './MedidaController';

import { systrace } from '../util/util';
import { Ingrediente } from '../model/Ingrediente';
import { Medida } from '../model/Medida';
import { TipoUnidade } from '../model/TipoUnidade';
import { Unidade } from '../model/Unidade';

import unidadeView from '../view/UnidadeView';

class UnidadeController {
    // Métodos de rotas
    async index (request: Request, response: Response) {
        const repository = getCustomRepository(UnidadeRepository);

        const unidades = await repository.find({
            relations: [ 'medida', 'ingrediente' ],
            order: {
                id: 'ASC'
            }
        });

        return systrace(200, response, unidadeView.renderManyComplex(unidades));
    }

    // Métodos internos
    async import(dados: any) {
        const {
            taxaConversao,
            nomeMedida,
            nomeIngrediente
        } = dados as {
            taxaConversao: number,
            nomeMedida: string,
            nomeIngrediente?: string,
            };

        const medidaController = new MedidaController();
        const ingredienteController = new IngredienteController();

        let ingrediente: Ingrediente | undefined = undefined;
        if (nomeIngrediente)  {
            ingrediente = await ingredienteController.findByName(nomeIngrediente);
        }

        const medida = ingrediente ? await medidaController.findByType(nomeMedida, ingrediente.tipoUnidade) : await medidaController.findByType(nomeMedida);
        const unidade = new Unidade(taxaConversao, medida);

        if (ingrediente) unidade.ingrediente = ingrediente;

        await unidade.save();
    }

    async find(medida: Medida, ingrediente: Ingrediente): Promise<Unidade> {
        const repository = getCustomRepository(UnidadeRepository);

        try {
            return await repository.findByIngredient(medida, ingrediente);
        } catch (err) {
            console.log(medida);

            return await repository.findSI(medida);
        }
    }

    async findByIngredient(ingrediente: Ingrediente): Promise<Unidade[]> {
        const repository = getCustomRepository(UnidadeRepository);

        try {
            return await repository.findByIngredientAndType(ingrediente);
        } catch (err) {
            return [];
        }
    }

    async findSI(medida: Medida): Promise<Unidade> {
        const repository = getCustomRepository(UnidadeRepository);

        return await repository.findSI(medida);
    }

    async findSI2(tipo?: TipoUnidade): Promise<Unidade[]> {
        const repository = getCustomRepository(UnidadeRepository);

        return await repository.findSI2(tipo);
    }
}

export default UnidadeController;