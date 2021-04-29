import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import util from '../util/util';

import { IngredienteRepository } from '../repository/IngredienteRepository';

import { Ingrediente, TipoIngrediente as tipoIngrediente } from '../model/Ingrediente';
import { TipoUnidade as tipoUnidade } from '../model/TipoUnidade';

class IngredienteController {
    // Métodos das rotas
    async index(request: Request, response: Response) {

    }
    // Métodos internos
    async import(dados: any) {
        const {
            Nome,
            TipoUnidade,
            TipoIngrediente,
            SemMedida,
            DerivadoLeite,
            Gluten
        } = dados as {
            Nome: string,
            TipoUnidade: tipoUnidade,
            TipoIngrediente: tipoIngrediente,
            SemMedida?: string,
            DerivadoLeite?: string,
            Gluten?: string
            };

        const semMedida = util.getBoolean(SemMedida);
        const derivadoLeite = util.getBoolean(DerivadoLeite);
        const gluten = util.getBoolean(Gluten);

        const ingrediente = new Ingrediente(Nome, TipoUnidade, TipoIngrediente);

        if (semMedida !== null) ingrediente.semMedida = semMedida;
        if (derivadoLeite !== null) ingrediente.derivadoLeite = derivadoLeite;
        if (gluten !== null) ingrediente.gluten = gluten;

        await ingrediente.save();
    }
    async findByName(nome: string): Promise<Ingrediente> {
        const repository = getCustomRepository(IngredienteRepository);

        const ingrediente = await repository.findByName(nome.toLowerCase());

        if (!ingrediente) {
            throw Error('Ingrediente não encontrado.');
        }

        return ingrediente;
    }
}

export default IngredienteController;