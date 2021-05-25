import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { SeguidorRepository } from '../repository/SeguidorRepository';

import UsuarioController from './UsuarioController';

import { Seguidor } from '../model/Seguidor';
import { LogNotificacao } from '../model/LogNotificacao';
import { Usuario } from '../model/Usuario';
import { getBoolean } from '../util/util';

class SeguidorController {
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