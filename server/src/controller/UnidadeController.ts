import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { UnidadeRepository } from '../repository/UnidadeRepository';

import IngredienteController from './IngredienteController';
import MedidaController from './MedidaController';

import { Ingrediente } from '../model/Ingrediente';
import { TipoUnidade } from '../model/TipoUnidade';
import { Unidade } from '../model/Unidade';

import unidadeView from '../view/UnidadeView';


class UnidadeController {
    // Métodos internos
    async import(dados: any) {
        const {
            TaxaConversao,
            NomeMedida,
            NomeIngrediente
        } = dados as {
            TaxaConversao: number,
            NomeMedida: string,
            NomeIngrediente?: string,
            };

        const medidaController = new MedidaController();
        const ingredienteController = new IngredienteController();

        let ingrediente: Ingrediente | undefined = undefined;
        if (NomeIngrediente)  {
            ingrediente = await ingredienteController.findByName(NomeIngrediente);
        }

        const medida = ingrediente ? await medidaController.findByType(NomeMedida, ingrediente.tipoUnidade) : await medidaController.findByType(NomeMedida);
        const unidade = new Unidade(TaxaConversao, medida);

        if (ingrediente) unidade.ingrediente = ingrediente;

        await unidade.save();
    }

    async find(nome: string, ingrediente: Ingrediente): Promise<Unidade> {
        const repository = getCustomRepository(UnidadeRepository);
        const { id, tipoUnidade } = ingrediente;

        if (tipoUnidade === TipoUnidade[TipoUnidade.PESO]) {
            try {
                return await repository.findByIngrediente(nome, id);
            } catch (err) {
                return repository.findBySigla(nome, [TipoUnidade[TipoUnidade.PESO]]);
            }
        } else {
            return await repository.findBySigla(nome, [TipoUnidade[TipoUnidade.VOLUME], TipoUnidade[TipoUnidade.UNIDADE]]);
        }
    }

    async findSI(tipoUnidade: TipoUnidade): Promise<Unidade[]> {
        const repository = getCustomRepository(UnidadeRepository);

        const unidades = await repository.find({
            where: {
                'tipo': tipoUnidade,
                'ingrediente': null
            }
        });

        return unidades;
    }
}

export default UnidadeController;