import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { ReceitaRepository } from '../repository/ReceitaRepository';

import UsuarioController from './UsuarioController';

import { Receita, Tipo } from '../entity/Receita';

class ReceitaController {
    // Métodos internos
    async insert(nome: string, descricao: string, tipo: Tipo, usuarioStr?: string): Promise<Receita> {
        const repository = getCustomRepository(ReceitaRepository);

        try {
            const usuarioController = new UsuarioController();

            const usuario = await usuarioController.findByLoginOrEmail(usuarioStr);

            const receita = repository.create({
                nome,
                descricao,
                tipo,
                usuario
            });

            await repository.save(receita);

            return receita;
        } catch (err) {
            throw err;
        }
    }
}

export default ReceitaController;