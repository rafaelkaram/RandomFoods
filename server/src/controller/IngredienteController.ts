import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { IngredienteRepository } from '../repository/IngredienteRepository';

import { Ingrediente, TipoIngrediente } from '../entity/Ingrediente';

class IngredienteController {
    // Métodos internos
    async findByName(nome: string): Promise<Ingrediente> {
        const repository = getCustomRepository(IngredienteRepository);

        const ingredientes = await repository.findByNome(nome);

        if (!ingredientes) {
            throw Error('Ingrediente não encontrado.');
        }

        return ingredientes;
    }
}

export default IngredienteController;