import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import fs from 'fs';
import path from 'path';

import util from '../util/util';

import { UsuarioRepository } from '../repository/UsuarioRepository';

import { Usuario, Perfil as Profile } from '../model/Usuario';

class UsuarioController {
    // Métodos das rotas
    // Métodos internos
    async import(dados: any) {

        const {
            Login,
            Nome,
            Email,
            Senha,
            Ativo,
            TrocaLogin,
            Perfil,
            NotificarSeguidor,
            NotificarAvaliacao,
            NotificarComentario,
            NotificarFavorito,
            NotificarResposta,
            NotificarMarca,
        } = dados as {
            Login: string,
            Nome: string,
            Email: string,
            Senha: string,
            Ativo?: string,
            TrocaLogin?: string,
            Perfil?: Profile,
            NotificarSeguidor?: string,
            NotificarAvaliacao?: string,
            NotificarComentario?: string,
            NotificarFavorito?: string,
            NotificarResposta?: string,
            NotificarMarca?: string,
        };

        const hash = util.getHash(Senha);
        const ativo = util.getBoolean(Ativo);
        const trocaLogin = util.getBoolean(TrocaLogin);
        const seguidor = util.getBoolean(NotificarSeguidor);
        const avaliacao = util.getBoolean(NotificarAvaliacao);
        const comentario = util.getBoolean(NotificarComentario);
        const favorito = util.getBoolean(NotificarFavorito);
        const resposta = util.getBoolean(NotificarResposta);
        const marca = util.getBoolean(NotificarMarca);

        const usuario = new Usuario(Login, Nome, Email, hash);

        if (ativo !== null) usuario.ativo = ativo;
        if (trocaLogin !== null) usuario.trocaLogin = trocaLogin;
        if (Perfil) usuario.perfil = Perfil;
        if (seguidor !== null) usuario.notificarSeguidor = seguidor;
        if (avaliacao !== null) usuario.notificarAvaliacao = avaliacao;
        if (comentario !== null) usuario.notificarComentario = comentario;
        if (favorito !== null) usuario.notificarFavorito = favorito;
        if (resposta !== null) usuario.notificarResposta = resposta;
        if (marca !== null) usuario.notificarMarca = marca;

        await usuario.save();

    }

    async findByLoginOrEmail(data?: string): Promise<Usuario> {
        const repository = getCustomRepository(UsuarioRepository);

        let usuario: any = null;
        if (data)
            usuario = await repository.findByLoginOrEmail(data);

        if (!usuario)
            usuario = await repository.findOne({ id: 1 });

        return usuario;
    }
}

export default UsuarioController;