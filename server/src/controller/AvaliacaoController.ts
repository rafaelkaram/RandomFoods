import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { AvaliacaoRepository } from '../repository/AvaliacaoRepository';

import ReceitaController from './ReceitaController';
import UsuarioController from './UsuarioController';

import { Avaliacao } from '../model/Avaliacao';
import { Receita } from '../model/Receita';
import { LogNotificacao } from '../model/LogNotificacao';

class AvaliacaoController {
    // Métodos internos
    async import(dados: any) {
        const {
            Nota,
            Usuario,
            Receita,
            UsuarioReceita
        } = dados as {
            Nota: number,
            Usuario: string,
            Receita: string,
            UsuarioReceita: string
        };

        const receitaController = new ReceitaController();
        const usuarioController = new UsuarioController();

        const usuario = await usuarioController.findByLoginOrEmail(Usuario);
        const usuarioReceita = await usuarioController.findByLoginOrEmail(UsuarioReceita);
        const receita = await receitaController.findByNameAndUser(Receita, usuarioReceita);

        const log = new LogNotificacao(usuarioReceita);
        await log.save();

        const avaliacao = new Avaliacao(Nota, usuario, receita, log);

        await avaliacao.save();

        log.avaliacao = avaliacao;
        await log.save();
    }

    async countVotes(id: number): Promise<{ nota: number, qtdeNotas: number}> {
        const repository = getCustomRepository(AvaliacaoRepository);

        const avaliacao = await repository.findByReceitaId(id);

        return avaliacao;
    }
}

export default AvaliacaoController;