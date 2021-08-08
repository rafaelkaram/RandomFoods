import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { systrace, syserror } from '../util/util';

import { CurtidaRepository } from '../repository/CurtidaRepository';

import ReceitaController from './ReceitaController';
import UsuarioController from './UsuarioController';

import { Curtida } from '../model/Curtida';
import { LogNotificacao } from '../model/LogNotificacao';
import { Receita } from '../model/Receita';
import { Usuario } from '../model/Usuario';

class CurtidaController {
    // Métodos das rotas
    async create(request: Request, response: Response) {
        const repository = getCustomRepository(CurtidaRepository);

        const idUsuario: number = request.idUsuario as number;
        const { idReceita } = request.body as { idReceita: number };

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

            // log.curtida = curtida;
            // await log.save();

            systrace(204, response);
        } catch (err) {
            syserror(400, response, { error: err });
        }
    }

    async findTopCurtidas(request: Request, response: Response){
        const repository = getCustomRepository(CurtidaRepository);

        const idUsuario: number = request.idUsuario as number;

        const curtidas = await repository.findTopCurtidas(idUsuario);

        return response.status(200).json(curtidas);
    }

    async remove(request: Request, response: Response) {
        const repository = getCustomRepository(CurtidaRepository);

        const idUsuario: number = request.idUsuario as number;
        const { id } = request.params;

        const usuarioController = new UsuarioController();

        const usuario: Usuario = await usuarioController.find(idUsuario);
        const curtida: Curtida = await repository.findOneOrFail({
            where: {
                id: parseInt(id),
                usuario
            }
        });
        curtida.remove();
        curtida.save();

        return systrace(204, response);
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

    async find(receita: Receita): Promise<Curtida[]> {
        const repository = getCustomRepository(CurtidaRepository);

        const curtidas = await repository.find({
            relations: [ 'usuario' ],
            where: {
                receita,
            }
        });

        return curtidas;
    }

    async count(receita: Receita): Promise<number> {
        const repository = getCustomRepository(CurtidaRepository);

        const curtidas = await repository.count({ receita });

        return curtidas;
    }

    async findPorCurtidas(): Promise<number[]> {
        const repository = getCustomRepository(CurtidaRepository);

        const curtidas: { id: number }[] = await repository.findPorCurtida();

        return curtidas.map(curtida => {
            return curtida.id
        });
    }
}

export default CurtidaController;