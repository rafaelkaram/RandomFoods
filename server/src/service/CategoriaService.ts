import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { CategoriaRepository } from '../repository/CategoriaRepository';

import { Categoria, Tipo } from '../entity/Categoria';
import { Receita } from '../entity/Receita';

class CategoriaService {
    // Métodos das rotas
    async index (request: Request, response: Response) {
        const repository = getCustomRepository(CategoriaRepository);

        const categorias = await repository.find();

        return response.status(200).json(categorias);
    }

    async countCategoryByUserId(request: Request, response: Response) {
        const repository = getCustomRepository(CategoriaRepository);

        const { id } = request.params;
        const id_usuario = parseInt(id);

        const categorias = await repository.countCategoryByUserId(id_usuario);

        return response.status(200).json(categorias);
    }

    // Métodos internos
    async insertByRecipe(categorias: Tipo[], receita: Receita): Promise<Categoria[]> {
        const repository = getCustomRepository(CategoriaRepository);

        const categoriaList = [];

        for (var key in categorias) {
            const categoriaEnum = categorias[key];

            const categoria = repository.create({
                nome: categoriaEnum,
                receita
            })

            await repository.save(categoria);

            categoriaList.push(categoria);
        }

        return categoriaList;
    }
}

export default CategoriaService;