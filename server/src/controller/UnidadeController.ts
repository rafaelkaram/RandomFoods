import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { UnidadeRepository } from '../repository/UnidadeRepository';

import IngredienteController from './IngredienteController';

import { Ingrediente } from '../entity/Ingrediente';
import { TipoUnidade } from '../entity/TipoUnidade';
import { Unidade } from '../entity/Unidade';

import unidadeView from '../view/UnidadeView';


class UnidadeController {
    // Métodos internos
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