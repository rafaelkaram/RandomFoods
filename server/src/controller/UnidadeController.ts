import { Request, response, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { UnidadeRepository } from '../repository/UnidadeRepository';

import IngredienteController from './IngredienteController';
import MedidaController from './MedidaController';

import { Ingrediente } from '../model/Ingrediente';
import { TipoUnidade } from '../model/TipoUnidade';
import { Unidade } from '../model/Unidade';

import unidadeView from '../view/UnidadeView';
import { Medida } from '../model/Medida';


class UnidadeController {
    // Métodos de rotas

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
            return await repository.findSI(medida);
        }
    }

    async findSI(medida: Medida): Promise<Unidade> {
        const repository = getCustomRepository(UnidadeRepository);

        return await repository.findSI(medida);
    }

    async findUnidade(): Promise<Unidade> {
        const repository = getCustomRepository(UnidadeRepository);

        return await repository.findUnidade();
    }
}

export default UnidadeController;