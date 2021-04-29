import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { ReceitaRepository } from '../repository/ReceitaRepository';

import UsuarioController from './UsuarioController';

import { Receita, Tipo } from '../model/Receita';
import { Usuario } from '../model/Usuario';

class ReceitaController {
    // Métodos internos
    async insert(nome: string, descricao: string, tipo: Tipo, usuarioStr?: string): Promise<Receita> {
        try {
            const usuarioController = new UsuarioController();

            const usuario = await usuarioController.findByLoginOrEmail(usuarioStr);

            const receita = new Receita(nome, descricao, tipo, usuario);

            await receita.save();

            return receita;
        } catch (err) {
            throw err;
        }
    }

    async findByNameAndUser(nome: string, usuario: Usuario): Promise<Receita> {
        const repository = getCustomRepository(ReceitaRepository);

        const receita: any = await repository.findByNameAndUser(nome, usuario);

        return receita;
    }
}

export default ReceitaController;