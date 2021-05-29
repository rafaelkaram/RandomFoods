import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import fs from 'fs';
import path from 'path';

import { getBoolean, getHash, getPath, moveFile, systrace, syserror, encryptMidia } from '../util/util';

import { UsuarioRepository } from '../repository/UsuarioRepository';

import LogNotificacaoController from './LogNotificacaoController';

import { Usuario, Perfil } from '../model/Usuario';

import usuarioView from '../view/UsuarioView';

class UsuarioController {
    // Métodos das rotas
    async index(request: Request, response: Response) {
        const repository = getCustomRepository(UsuarioRepository);

        const logNotificacaoController = new LogNotificacaoController();

        const usuarios: Usuario[] = await repository.findAll();
        const usuariosFull: { usuario: Usuario, qtdeLogs: number }[] = await Promise.all(usuarios.map(async (usuario: Usuario) => {
            return {
                usuario,
                qtdeLogs: await logNotificacaoController.countNotRead(usuario)
            }
        }));

        return systrace(200, response, usuarioView.renderMany(usuariosFull));
    }

    async fetch(request: Request, response: Response) {
        const repository = getCustomRepository(UsuarioRepository);

        const { id } = request.params;

        const logNotificacaoController = new LogNotificacaoController();

        const usuario: Usuario = await repository.findOneOrFail({ id: parseInt(id) });
        const qtdeLogs: number = await logNotificacaoController.countNotRead(usuario);

        return systrace(200, response, usuarioView.render(usuario, qtdeLogs));
    }

    async exist(request: Request, response: Response) {
        const repository = getCustomRepository(UsuarioRepository);

        const { value } = request.body as { value: string };

        try {
            await repository.findByLoginOrEmail(value ? value.toLowerCase() : '');
            return syserror(203, response, 'Deu ruim');
        } catch {
            return systrace(204, response);
        }
    }

    async create(request: Request, response: Response) {
        const { nome, login, email, senha } = request.body as {
            nome: string,
            login: string,
            email: string,
            senha: string
        };
        const image = request.file as Express.Multer.File;

        try {
            const usuario: Usuario = new Usuario(login, email, getHash(senha));
            if (nome) usuario.nome = nome;
            await usuario.save();

            const buffer = encryptMidia(usuario.id.toString());

            moveFile(buffer, image.filename);

            return systrace(200, response, usuarioView.render(usuario, 0));
        } catch (err) {
            const nomeArquivo: string = image.filename;

            console.log(`Removendo arquivo ${ nomeArquivo }.\nTipo de arquivo inválido`);
            fs.unlink(path.join(getPath('usuario'), nomeArquivo), (e) => {
                if (e) return syserror(400, response, e);;
            });
            return syserror(400, response, err);
        }
    }

    async remove(request: Request, response: Response) {
        const repository = getCustomRepository(UsuarioRepository);
        const { id } = request.params;

        const usuario = await repository.findOneOrFail({ id: parseInt(id) });
        usuario.ativo = false;
        usuario.save();

        return systrace(204, response);
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

        const hash = getHash(senha);
        const isAtivo = getBoolean(ativo);
        const isTrocaLogin = getBoolean(trocaLogin);
        const seguidor = getBoolean(notificarSeguidor);
        const avaliacao = getBoolean(notificarAvaliacao);
        const comentario = getBoolean(notificarComentario);
        const favorito = getBoolean(notificarFavorito);
        const resposta = getBoolean(notificarResposta);
        const marca = getBoolean(notificarMarca);

        const usuario = new Usuario(login, email, hash);

        if (nome !== null) usuario.nome = nome;
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