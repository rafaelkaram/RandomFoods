import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { CategoriaRepository } from '../repository/CategoriaRepository';

import { Categoria, Tipo } from '../model/Categoria';
import { Receita } from '../model/Receita';

class CategoriaController {
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
}

export default CategoriaController;