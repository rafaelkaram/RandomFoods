import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { IngredienteRepository } from '../repository/IngredienteRepository';

import { Ingrediente, TipoIngrediente } from '../entity/Ingrediente';

import imageView from '../view/ImageView';

class IngredienteService {
    // Métodos das rotas
    async index(request: Request, response: Response) {
        const repository = getCustomRepository(IngredienteRepository);

        const ingredientes = await repository.findAll();

        return response.status(200).json(ingredientes);
    }

    async fetch(request: Request, response: Response) {
        const repository = getCustomRepository(IngredienteRepository);

        const { id } = request.params;

        const ingrediente = await repository.findOne(id);

        if (!ingrediente) {
            return response.status(400).json({ error: 'Ingrediente não encontrado!' });
        }

        return response.status(200).json(ingrediente);
    }

    async create(request: Request, response: Response) {
        const repository = getCustomRepository(IngredienteRepository);
        const { nome, tipoUnidade, semMedida, derivadoLeite, gluten, tipoIngrediente } = request.body;

        const ingrediente = repository.create({
            nome,
            semMedida: semMedida ? true : false,
            derivadoLeite: derivadoLeite ? true : false,
            gluten: gluten ? true : false,
            tipoIngrediente,
            tipoUnidade
        });

        await repository.save(ingrediente);

        return response.status(201).json({ message: 'Ingrediente cadastrado com sucesso.' });
    }

    async createBulk(request: Request, response: Response) {
        const repository = getCustomRepository(IngredienteRepository);

        const ingredientes: Ingrediente[] = [];

        for (var key in request.body) {
            const { nome, tipoUnidade, semMedida, derivadoLeite, gluten, tipoIngrediente } = request.body[key];

            const ingrediente = repository.create({
                nome,
                semMedida: semMedida ? true : false,
                derivadoLeite: derivadoLeite ? true : false,
                gluten: gluten ? true : false,
                tipoIngrediente,
                tipoUnidade
            });

            await repository.save(ingrediente);

            ingredientes.push(ingrediente);
        }

        return response.status(201).json({ message: `${ingredientes.length} ingredientes cadastrados com sucesso.` });
    }

    async searchByIds(request: Request, response: Response) {
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

        for (var key in tiposIngrediente) {
            const tipoIngrediente = tiposIngrediente[key];

            const ingredientesObj = await repository.findByIdsWithUnidades(idsIngredientes, tipoIngrediente);

            if (ingredientesObj.length > 0) {


                ingredientes.push({ tipo: imageView.renderMany(ingredientesObj) });
            }
        }


        if (!ingredientes) {
            throw 'Nenhum ingrediente encontrado.';
        }

        return response.status(200).json(ingredientes);
    }

    async typeIndex(request: Request, response: Response) {
        const repository = getCustomRepository(IngredienteRepository);

        const tiposIngrediente = Object.keys(TipoIngrediente);
        const result = [];

        for (var key in tiposIngrediente) {
            const tipoIngrediente = tiposIngrediente[key];
            const ingredientes = await repository.find({ where: { tipoIngrediente }, order: { nome: 'ASC' } });

            result.push(imageView.renderMany(ingredientes));
        }

        return response.status(200).json(result);
    }

    async remove(request: Request, response: Response) {
        const repository = getCustomRepository(IngredienteRepository);
        const { id } = request.params;

        const ingrediente = await repository.findOne({ id: parseInt(id) });

        if (ingrediente) {
            await repository.remove([ingrediente]);
            return response.status(204).send();
        }

        return response.status(401).json({ error: 'Ingrediente não encontrado.' });
    }

    // Métodos internos
    async findById(id: number): Promise<Ingrediente> {
        const repository = getCustomRepository(IngredienteRepository);

        const ingrediente = await repository.findOne(id);

        if (!ingrediente) {
            throw 'Ingrediente não encontrado.';
        }

        return ingrediente;
    }

    async findByIds(ids: number[]): Promise<Ingrediente[]> {
        const repository = getCustomRepository(IngredienteRepository);

        const ingredientes = await repository.findByIdsOrdered(ids, 'nome', true);

        if (!ingredientes) {
            throw 'Nenhum ingrediente encontrado.';
        }

        return ingredientes;
    }

    async findByName(nome: string): Promise<Ingrediente> {
        const repository = getCustomRepository(IngredienteRepository);

        const ingredientes = await repository.findByName(nome.toLowerCase());

        if (!ingredientes) {
            throw Error('Ingrediente não encontrado.');
        }

        return ingredientes;
    }
}

export default IngredienteService;