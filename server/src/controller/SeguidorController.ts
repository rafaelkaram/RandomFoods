import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { SeguidorRepository } from '../repository/SeguidorRepository';

import UsuarioController from './UsuarioController';

import { Seguidor } from '../model/Seguidor';
import { LogNotificacao } from '../model/LogNotificacao';
import { Usuario } from '../model/Usuario';
import { getBoolean, syserror, systrace } from '../util/util';

import UsuarioView from '../view/UsuarioView';

class SeguidorController {
    // Métodos das rotas
    async index(request: Request, response: Response) {
        const repository: SeguidorRepository = getCustomRepository(SeguidorRepository);

        const midias: Seguidor[] = await repository.findAll();

        return response.status(200).json(midias);
    }

    async create(request: Request, response: Response) {
        const repository = getCustomRepository(SeguidorRepository);

        const { idSeguidor, idUsuario } = request.body as {
            idSeguidor: number,
            idUsuario: number
        };

        try {
            const usuarioController = new UsuarioController();

            const usuarioSeguidor: Usuario = await usuarioController.find(idSeguidor);
            const usuario: Usuario         = await usuarioController.find(idUsuario);

            const log: LogNotificacao = new LogNotificacao(usuario);
            await log.save();

            const seguidor: Seguidor = new Seguidor(usuario, usuarioSeguidor, log);

            console.log(seguidor);
            await seguidor.save();

            log.seguidor = seguidor;
            await log.save();

            systrace(201, response);
        } catch (err) {
            syserror(400, response, { error: err });
        }
    }

    async findByUsuario(request: Request, response: Response) {
        const repository = getCustomRepository(SeguidorRepository);

        const { id } = request.params;

        const seguidores = await repository.findByUsuario(parseInt(id));

        if (!seguidores) {
            syserror(400, response, { error: 'Seguidores não encontrados!' });
        }

        const seguidoresArray = seguidores.map(item => {
            return {
                id: item.id,
                usuario: UsuarioView.renderSimple(item.usuario)
            }
        });

        systrace(200, response, seguidoresArray);
    }

    async remove(request: Request, response: Response) {
        const repository = getCustomRepository(SeguidorRepository);
        const { id } = request.params;

        const seguidor = await repository.findOneOrFail({ id: parseInt(id) });
        seguidor.remove();
        seguidor.save();

        return systrace(204, response);
    }

    // Métodos internos
    async import(dados: any) {
        const {
            nomeUsuario,
            nomeSeguidor,
            notificarSeguidor
        } = dados as {
            nomeUsuario: string,
            nomeSeguidor: string,
            notificarSeguidor: string
        };

        const usuarioController = new UsuarioController();

        const usuario: Usuario = await usuarioController.findByLoginOrEmail(nomeUsuario);
        const usuarioSeguidor: Usuario = await usuarioController.findByLoginOrEmail(nomeSeguidor);
        const notificar: boolean | null = getBoolean(notificarSeguidor);

        const log: LogNotificacao = new LogNotificacao(usuarioSeguidor);
        await log.save();

        const seguidor: Seguidor = new Seguidor(usuario, usuarioSeguidor, log);

        if (notificar) seguidor.notificar = notificar;

        await seguidor.save();

        log.seguidor = seguidor;

        await log.save();
    }
}

export default SeguidorController;