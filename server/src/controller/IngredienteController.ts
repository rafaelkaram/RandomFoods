import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import util from '../util/util';

import { IngredienteRepository } from '../repository/IngredienteRepository';

import { Ingrediente, TipoIngrediente } from '../model/Ingrediente';
import { TipoUnidade } from '../model/TipoUnidade';

import TipoIngredienteView from '../view/TipoIngredienteView';

class IngredienteController {
    // Métodos das rotas
    async index(request: Request, response: Response) {
        const repository = getCustomRepository(IngredienteRepository);

        const ingredientes = await repository.findAll();

        return util.systrace(200, response, ingredientes);
    }

    async typeIndex(request: Request, response: Response) {
        const repository = getCustomRepository(IngredienteRepository);

        const tiposIngrediente = Object.keys(TipoIngrediente);
        const result = [];

        for (var key in tiposIngrediente) {
            const tipoIngrediente: TipoIngrediente = <TipoIngrediente> tiposIngrediente[key];
            const ingredientes = await repository.find({ where: { tipoIngrediente }, order: { nome: 'ASC' } });

            result.push(TipoIngredienteView.renderMany(ingredientes, tipoIngrediente));
        }

        return response.status(200).json(result);
    }

    // Métodos internos
    async import(dados: any) {
        const {
            nome,
            tipoUnidade,
            tipoIngrediente,
            semMedida,
            derivadoLeite,
            gluten
        } = dados as {
            nome: string,
            tipoUnidade: string,
            tipoIngrediente: string,
            semMedida?: string,
            derivadoLeite?: string,
            gluten?: string
        };

        const tipoU: TipoUnidade = <TipoUnidade> tipoUnidade.trim().toUpperCase();
        const tipoI: TipoIngrediente = <TipoIngrediente> tipoIngrediente.trim().toUpperCase();

        const isSemMedida = util.getBoolean(semMedida);
        const isDerivadoLeite = util.getBoolean(derivadoLeite);
        const isGluten = util.getBoolean(gluten);

        const ingrediente = new Ingrediente(nome.trim(), tipoU, tipoI);

        if (isSemMedida !== null) ingrediente.semMedida = isSemMedida;
        if (isDerivadoLeite !== null) ingrediente.derivadoLeite = isDerivadoLeite;
        if (isGluten !== null) ingrediente.gluten = isGluten;

        await ingrediente.save();
    }

    async findByName(nome: string): Promise<Ingrediente> {
        const repository = getCustomRepository(IngredienteRepository);

        const ingrediente: Ingrediente = await repository.findByName(nome);

        if (!ingrediente) {
            throw Error('Ingrediente não encontrado.');
        }

        return ingrediente;
    }
}

export default IngredienteController;