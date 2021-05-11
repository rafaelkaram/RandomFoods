import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { FavoritoRepository } from '../repository/FavoritoRepository';

import ReceitaController from './ReceitaController';
import UsuarioController from './UsuarioController';

import { Favorito } from '../model/Favorito';
import { LogNotificacao } from '../model/LogNotificacao';
import { Receita } from '../model/Receita';
import { Usuario } from '../model/Usuario';

class FavoritoController {
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

        const favorito: Favorito = new Favorito(usuario, receita, log);

        await favorito.save();

        log.favorito = favorito;

        await log.save();
    }
}

export default FavoritoController;