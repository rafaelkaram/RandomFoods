import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import fs, { lchown } from 'fs';
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

    async fbLogin(request: Request, response: Response) {
        const repository = getCustomRepository(UsuarioRepository);

        const { id, name } = request.body;

        try {
            const usuario: Usuario = await repository.findOneOrFail({ idExterno: id });

            const logNotificacaoController = new LogNotificacaoController();
            const qtdeLogs = await logNotificacaoController.countNotRead(usuario);

            return systrace(200, response, usuarioView.render(usuario, qtdeLogs));
        } catch (err) {
            const dados: string = name.replace(' ', '').toLowerCase();
            const now: number = Date.now();

            const usuario = new Usuario(dados + now, dados + now, getHash(now.toString()));
            usuario.idExterno = id;
            usuario.nome = name;
            usuario.trocaLogin = true;

            await usuario.save();

            return systrace(200, response, usuarioView.render(usuario, 0));
        }
    }

    async login(request: Request, response: Response) {
        const repository = getCustomRepository(UsuarioRepository);

        const { login, senha } = request.body as { login: string, senha: string };

        try {
            const logNotificacaoController = new LogNotificacaoController();

            const usuario: Usuario = await repository.findByLoginOrEmail(login ? login.toLowerCase() : '');
            const qtdeLogs: number = await logNotificacaoController.countNotRead(usuario);

            if (usuario.idExterno) throw 'Login ou senha inválidos.';
            if (usuario && usuario.senha === getHash(senha)) {
                return systrace(200, response, usuarioView.render(usuario, qtdeLogs));
            }
            throw 'Login ou senha inválidos.';

        } catch (err) {
            return syserror(400, response, err);
        }
    }

    async exist(request: Request, response: Response) {
        const repository = getCustomRepository(UsuarioRepository);

        const { login, email } = request.body as { login: string, email: string };
        console.log({ login, email });


        try {
            if (login) await repository.findOneOrFail({ login: login.toLowerCase() });
            else if (email) await repository.findOneOrFail({ email: email.toLowerCase() });
            return syserror(400, response, 'Usuário ou e-mail já cadastrado.');
        } catch (err) {
            return systrace(200, response, 'Usuário ou e-mail disponível.');
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

            if (image) moveFile(buffer, image.filename);

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
            notificarCurtida,
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
            notificarCurtida?: string,
            notificarResposta?: string,
            notificarMarca?: string,
        };

        const hash = getHash(senha);
        const isAtivo = getBoolean(ativo);
        const isTrocaLogin = getBoolean(trocaLogin);
        const seguidor = getBoolean(notificarSeguidor);
        const avaliacao = getBoolean(notificarAvaliacao);
        const comentario = getBoolean(notificarComentario);
        const curtida = getBoolean(notificarCurtida);
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
        if (curtida !== null) usuario.notificarCurtida = curtida;
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