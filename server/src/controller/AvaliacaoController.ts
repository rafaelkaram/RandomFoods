import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { AvaliacaoRepository } from '../repository/AvaliacaoRepository';

import ReceitaController from './ReceitaController';
import UsuarioController from './UsuarioController';

import { Avaliacao } from '../model/Avaliacao';
import { LogNotificacao } from '../model/LogNotificacao';
import { Receita } from '../model/Receita';
import { Usuario } from '../model/Usuario';

class AvaliacaoController {
    // Métodos das rotas
    async findVoted(request: Request, response: Response){
        const repository = getCustomRepository(AvaliacaoRepository);

        const { id } = request.params;
        const usuarioId = parseInt(id);

        const avaliacoes = await repository.findByUserId(usuarioId);

        return response.status(200).json(avaliacoes);
    }

    // Métodos internos
    async import(dados: any) {
        const {
            nota,
            nomeUsuario,
            nomeReceita,
            nomeUsuarioReceita
        } = dados as {
            nota: number,
            nomeUsuario: string,
            nomeReceita: string,
            nomeUsuarioReceita: string
        };

        const receitaController = new ReceitaController();
        const usuarioController = new UsuarioController();

        const usuario: Usuario = await usuarioController.findByLoginOrEmail(nomeUsuario);
        const usuarioReceita: Usuario = await usuarioController.findByLoginOrEmail(nomeUsuarioReceita);
        const receita: Receita = await receitaController.findByNameAndUser(nomeReceita, usuarioReceita);

        const log: LogNotificacao = new LogNotificacao(usuarioReceita);
        await log.save();

        const avaliacao: Avaliacao = new Avaliacao(nota, usuario, receita, log);

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