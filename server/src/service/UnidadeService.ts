import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { UnidadeRepository } from '../repository/UnidadeRepository';

import IngredienteService from './IngredienteService';

import { Ingrediente } from '../entity/Ingrediente';
import { TipoUnidade } from '../entity/TipoUnidade';
import { Unidade } from '../entity/Unidade';

import unidadeView from '../view/UnidadeView';


class UnidadeService {
    // Métodos das rotas
    async index (request: Request, response: Response) {
        const repository = getCustomRepository(UnidadeRepository);

        const unidades = await repository.findAll();

        return response.status(200).json(unidades);
    }

    async list(request: Request, response: Response) {
        const repository = getCustomRepository(UnidadeRepository);

        const unidades = await repository.findWithIngrediente();

        if (!unidades) {
            return response.status(400).json({ error: 'Unidade não encontrada!'});
        }

        return response.status(200).json(unidadeView.renderMany(unidades));
    }

    async fetch(request: Request, response: Response) {
        const repository = getCustomRepository(UnidadeRepository);

        const { id } = request.params;

        const unidade = await repository.findOne(id);

        if (!unidade) {
            return response.status(400).json({ error: 'Unidade não encontrada!'});
        }

        return response.status(200).json(unidade);
    }

    async create(request: Request, response: Response) {
        const repository = getCustomRepository(UnidadeRepository);

        const unidade = await this.save(request.body);

        return response.status(201).json({ message: 'Unidade cadastrada com sucesso.' });
    }

    async createBulk(request: Request, response: Response) {

        const dados = request.body;

        let count = 0;
        dados.map(async (dado: any) => {
            const success: boolean = await this.save(dado);

            if (success) count++;
        });

        return response.status(201).json({ message: `${ count } unidades cadastradas com sucesso.` });
    }

    async remove(request: Request, response: Response) {
        const repository = getCustomRepository(UnidadeRepository);
        const { id } = request.params;

        const unidade = await repository.findOne({ id: parseInt(id) });

        if (!unidade) {
            return response.status(401).json({ error: 'Operação não permitida.' });
        }

        await repository.remove([ <Unidade> unidade ]);

        return response.status(204).send();
    }

    // Métodos internos
    async save(dado: any): Promise<boolean>{
        const repository = getCustomRepository(UnidadeRepository);

        const { nome, sigla, taxaConversao, tipo, idIngrediente } = dado;

        let unidade = null;

        try {
            if (idIngrediente) {
                const ingredienteService = new IngredienteService();
                const ingrediente = await ingredienteService.findById(idIngrediente);

                unidade = repository.create({
                    nome,
                    sigla,
                    taxaConversao,
                    tipo,
                    ingrediente
                });

                await repository.save(unidade);
            } else {

                unidade = repository.create({
                    nome,
                    sigla,
                    taxaConversao,
                    tipo
                });

                await repository.save(unidade);
            }

            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }


    async find(nome: string, ingrediente: Ingrediente): Promise<Unidade> {
        const repository = getCustomRepository(UnidadeRepository);
        const { id, tipoUnidade  } = ingrediente;

        if (tipoUnidade === TipoUnidade[TipoUnidade.PESO]) {
            try {
                return await repository.findByIngrediente(nome, id);
            } catch (err) {
                return repository.findBySigla(nome, [ TipoUnidade[TipoUnidade.PESO] ]);
            }
        } else {
            return await repository.findBySigla(nome, [ TipoUnidade[TipoUnidade.VOLUME], TipoUnidade[TipoUnidade.UNIDADE] ]);
        }
    }

    async findById(id: number): Promise<Unidade> {
        const repository = getCustomRepository(UnidadeRepository);

        const unidade = await repository.findOne(id);

        if (!unidade) {
            throw Error;
        }

        return unidade;
    }
}

export default UnidadeService;