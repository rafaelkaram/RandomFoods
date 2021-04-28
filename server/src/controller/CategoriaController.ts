import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { CategoriaRepository } from '../repository/CategoriaRepository';

import { Categoria, Tipo } from '../entity/Categoria';
import { Receita } from '../entity/Receita';

class CategoriaController {
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

export default CategoriaController;