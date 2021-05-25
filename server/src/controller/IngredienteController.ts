import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { getBoolean, systrace } from '../util/util';

import { IngredienteRepository } from '../repository/IngredienteRepository';

import UnidadeController from './UnidadeController';

import { Ingrediente, TipoIngrediente } from '../model/Ingrediente';
import { TipoUnidade } from '../model/TipoUnidade';
import { Unidade } from '../model/Unidade';

import tipoIngredienteView from '../view/TipoIngredienteView';

class IngredienteController {
    // Métodos das rotas
    async index(request: Request, response: Response) {
        const repository = getCustomRepository(IngredienteRepository);

        const ingredientes = await repository.findAll();

        return systrace(200, response, ingredientes);
    }

    async typeIndex(request: Request, response: Response) {
        const repository = getCustomRepository(IngredienteRepository);

        const tiposIngrediente = Object.keys(TipoIngrediente);
        const result = [];

        for (var key in tiposIngrediente) {
            const tipoIngrediente: TipoIngrediente = <TipoIngrediente> tiposIngrediente[key];
            const ingredientes = await repository.find({ where: { tipoIngrediente }, order: { nome: 'ASC' } });

            if (ingredientes && ingredientes.length > 0)
                result.push(tipoIngredienteView.renderManySimple(ingredientes, tipoIngrediente));
        }

        return response.status(200).json(result);
    }

    async findByIds(request: Request, response: Response) {
        const repository = getCustomRepository(IngredienteRepository);

        const { ids } = request.query as { ids: string[] };
        if (!ids) {
            throw 'Nenhum ingrediente encontrado.';
        }

        const idsIngredientes = ids.map((id: string) => {
            return parseInt(id);
        });

        const tiposIngrediente = Object.keys(TipoIngrediente);

        const ingredientes = [];

        const unidadeController = new UnidadeController();

        for (var key in tiposIngrediente) {
            const tipoIngrediente: TipoIngrediente = <TipoIngrediente>tiposIngrediente[key];
            const ingredientesObj: Ingrediente[] = await repository.findByIdsAndType(idsIngredientes, tipoIngrediente);
            await Promise.all(ingredientesObj.map(async ingrediente => {
                const unidadesIngrediente: Unidade[] = [];
                const unidadesEspecificas: Unidade[] = await unidadeController.findByIngredient(ingrediente);
                const unidades: Unidade[] = await unidadeController.findSI2(ingrediente.tipoUnidade);
                await Promise.all(unidadesEspecificas?.map(unidade => {
                    unidadesIngrediente.push(unidade);
                }));
                await Promise.all(unidades?.map(unidade => {
                    unidadesIngrediente.push(unidade);
                }));
                ingrediente.unidades = unidadesIngrediente;
            }));

            if (ingredientesObj.length > 0) {
                ingredientes.push(tipoIngredienteView.renderMany(ingredientesObj, tipoIngrediente));
            }
        }

        if (!ingredientes) {
            throw 'Nenhum ingrediente encontrado.';
        }

        return response.status(200).json(ingredientes);
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

        const isSemMedida = getBoolean(semMedida);
        const isDerivadoLeite = getBoolean(derivadoLeite);
        const isGluten = getBoolean(gluten);

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