import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { CategoriaRepository } from '../repository/CategoriaRepository';

import { Categoria, Tipo } from '../model/Categoria';
import { Receita } from '../model/Receita';
import { systrace } from '../util/util';

class CategoriaController {
    // Métodos das rotas
    async index (request: Request, response: Response) {
        const tipos = Object.values(Tipo);

        return systrace(200, response, tipos);
    }

    async countCategoryByUserId(request: Request, response: Response) {
        const repository = getCustomRepository(CategoriaRepository);

        const { id } = request.params;
        const usuarioId = parseInt(id);

        const categorias = await repository.countCategoryByUserId(usuarioId);

        return systrace(200, response, categorias);
    }

    // Métodos internos
    async insertByRecipe(categorias: Tipo[], receita: Receita): Promise<Categoria[]> {
        const categoriaList = [];

        for (var key in categorias) {
            const categoriaEnum = categorias[key];

            const categoria = new Categoria(categoriaEnum, receita);

            await categoria.save();

            categoriaList.push(categoria);
        }

        return categoriaList;
    }

    async findByCategoria(id: number, categoria: string): Promise<number[]> {
        const repository = getCustomRepository(CategoriaRepository);

        const categorias = await repository.findByCategoryAndUserId(id, categoria);

        const ids = categorias.map(item => item.receita);
        console.log(ids);

        return ids;
    }
}

export default CategoriaController;