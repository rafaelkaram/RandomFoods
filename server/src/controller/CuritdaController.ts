import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { CurtidaRepository } from '../repository/CurtidaRepository';

import ReceitaController from './ReceitaController';
import UsuarioController from './UsuarioController';

import { Curtida } from '../model/Curtida';
import { LogNotificacao } from '../model/LogNotificacao';
import { Receita } from '../model/Receita';
import { Usuario } from '../model/Usuario';
import { systrace, syserror } from '../util/util';

class CurtidaController {
    // Métodos das rotas
    async create(request: Request, response: Response) {
        const repository = getCustomRepository(CurtidaRepository);

        const { idReceita, idUsuario } = request.body as {
            idReceita: number,
            idUsuario: number
        };

        try {
            const usuarioController = new UsuarioController();
            const receitaController = new ReceitaController();

            const usuario: Usuario = await usuarioController.find(idUsuario);
            const receita: Receita = await receitaController.find(idReceita);

            const log: LogNotificacao = new LogNotificacao(usuario);
            await log.save();

            const curtida: Curtida = new Curtida(usuario, receita, log);

            console.log(curtida);
            await curtida.save();

            log.curtida = curtida;
            await log.save();

            systrace(201, response);
        } catch (err) {
            syserror(400, response, { error: err });
        }
    }
    // Métodos internos
    async import(dados: any) {
        const {
            nomeUsuario,
            nomeReceita,
            nomeUsuarioReceita
        } = dados as {
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

        const curtida: Curtida = new Curtida(usuario, receita, log);

        await curtida.save();

        log.curtida = curtida;

        await log.save();
    }
}

export default CurtidaController;