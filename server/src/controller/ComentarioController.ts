import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { ComentarioRepository } from '../repository/ComentarioRepository';

import ReceitaController from './ReceitaController';
import UsuarioController from './UsuarioController';

import { Comentario } from '../model/Comentario';
import { LogNotificacao } from '../model/LogNotificacao';
import { Receita } from '../model/Receita';
import { Usuario } from '../model/Usuario';
import { Marca } from '../model/Marca';

import comentarioView from '../view/ComentarioView';

class ComentarioController {
    // Métodos das rotas
    async findByReceita(request: Request, response: Response) {
        const repository = getCustomRepository(ComentarioRepository);

        const { idReceita } = request.params;

        const comentarios = await repository.findByReceita(parseInt(idReceita));

        if (!comentarios) {
            return response.status(400).json({ error: 'Comentarios não encontrado!' });
        }

        return response.status(200).json(comentarioView.renderMany(comentarios));
    }

    // Métodos internos
    async import(dados: any) {
        const repository = getCustomRepository(ComentarioRepository);

        const {
            texto,
            nomeUsuario,
            nomeReceita,
            nomeUsuarioReceita,
            nomeUsuarioMarca,
            idPai
        } = dados as {
            texto: string,
            nomeUsuario: string,
            nomeReceita: string,
            nomeUsuarioReceita: string,
            nomeUsuarioMarca?: string,
            idPai?: number
        };

        const receitaController = new ReceitaController();
        const usuarioController = new UsuarioController();

        const usuario: Usuario = await usuarioController.findByLoginOrEmail(nomeUsuario);
        const usuarioReceita: Usuario = await usuarioController.findByLoginOrEmail(nomeUsuarioReceita);
        const receita: Receita = await receitaController.findByNameAndUser(nomeReceita, usuarioReceita);

        const log: LogNotificacao = new LogNotificacao(usuarioReceita);
        await log.save();

        const comentario: Comentario = new Comentario(texto, usuario, receita, log);

        if (idPai) {
            const comentarioPai: Comentario = await repository.findOneOrFail({ id: idPai });
            comentario.comentarioPai = comentarioPai;
        }
        if (nomeUsuarioMarca) {
            const nomes: string[] = nomeUsuarioMarca.trim().split(',');
            const marcas: Marca[] = [];
            for (let i in nomes) {
                const nome: string = nomes[i];
                const usuarioMarca: Usuario = await usuarioController.findByLoginOrEmail(nome);
                const logMarca: LogNotificacao = new LogNotificacao(usuarioMarca);

                await logMarca.save();

                const marca: Marca = new Marca(usuarioMarca, comentario, logMarca);

                await marca.save();

                marcas.push(marca);
                logMarca.marca = marca;

                await logMarca.save();
            }

            comentario.marcas = marcas;
        }

        await comentario.save();

        log.comentario = comentario;

        await log.save();
    }
}

export default ComentarioController;