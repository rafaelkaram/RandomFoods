import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import fs from 'fs';
import path from 'path';

import util from '../util/util';

import { UsuarioRepository } from '../repository/UsuarioRepository';

import { Usuario, Perfil } from '../model/Usuario';

class UsuarioController {
    // Métodos das rotas
    async index(request: Request, response: Response) {
        const repository = getCustomRepository(UsuarioRepository);

        const usuarios = await repository.findAll();

        return util.systrace(200, response, usuarios);
    }

    // Métodos internos
    async import(dados: any) {

        const {
            login,
            nome,
            email,
            senha,
            ativo,
            trocaLogin,
            perfil,
            notificarSeguidor,
            notificarAvaliacao,
            notificarComentario,
            notificarFavorito,
            notificarResposta,
            notificarMarca,
        } = dados as {
            login: string,
            nome: string,
            email: string,
            senha: string,
            ativo?: string,
            trocaLogin?: string,
            perfil?: Perfil,
            notificarSeguidor?: string,
            notificarAvaliacao?: string,
            notificarComentario?: string,
            notificarFavorito?: string,
            notificarResposta?: string,
            notificarMarca?: string,
        };

        const hash = util.getHash(senha);
        const isAtivo = util.getBoolean(ativo);
        const isTrocaLogin = util.getBoolean(trocaLogin);
        const seguidor = util.getBoolean(notificarSeguidor);
        const avaliacao = util.getBoolean(notificarAvaliacao);
        const comentario = util.getBoolean(notificarComentario);
        const favorito = util.getBoolean(notificarFavorito);
        const resposta = util.getBoolean(notificarResposta);
        const marca = util.getBoolean(notificarMarca);

        const usuario = new Usuario(login, nome, email, hash);

        if (isAtivo !== null) usuario.ativo = isAtivo;
        if (isTrocaLogin !== null) usuario.trocaLogin = isTrocaLogin;
        if (perfil) usuario.perfil = perfil;
        if (seguidor !== null) usuario.notificarSeguidor = seguidor;
        if (avaliacao !== null) usuario.notificarAvaliacao = avaliacao;
        if (comentario !== null) usuario.notificarComentario = comentario;
        if (favorito !== null) usuario.notificarFavorito = favorito;
        if (resposta !== null) usuario.notificarResposta = resposta;
        if (marca !== null) usuario.notificarMarca = marca;

        await usuario.save();

    }

    async find(id: number): Promise<Usuario> {
        const repository = getCustomRepository(UsuarioRepository);

        const usuario: Usuario = await repository.findOneOrFail({ id });

        return usuario;
    }

    async findByLoginOrEmail(data?: string): Promise<Usuario> {
        const repository = getCustomRepository(UsuarioRepository);

        let usuario: Usuario | null = null;
        if (data) {
            const valor = data.trim().toLowerCase();
            usuario = await repository.findByLoginOrEmail(valor);
        }
        if (!usuario)
            usuario = await repository.findOneOrFail({ id: 1 });

        return usuario;
    }
}

export default UsuarioController;