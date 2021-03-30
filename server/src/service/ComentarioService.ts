import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { ComentarioRepository } from '../repository/ComentarioRepository';

import ReceitaService from './ReceitaService';
import UsuarioService from './UsuarioService';

class ComentarioService {
    // Métodos das rotas
    async index (request: Request, response: Response) {
        const repository = getCustomRepository(ComentarioRepository);

        const comentarios = await repository.findAll();

        return response.status(200).json(comentarios);
    }

    async fetch(request: Request, response: Response) {
        const repository = getCustomRepository(ComentarioRepository);

        const { id } = request.params;

        const comentario = await repository.findOne(id);

        if (!comentario) {
            return response.status(400).json({ error: 'Comentario não encontrado!' });
        }

        return response.status(200).json(comentario);
    }

    async findByReceita(request: Request, response: Response) {
        const repository = getCustomRepository(ComentarioRepository);

        const { idReceita } = request.params;

        const comentario = await repository.findByReceita(parseInt(idReceita));

        if (!comentario) {
            return response.status(400).json({ error: 'Comentario não encontrado!' });
        }

        return response.status(200).json(comentario);
    }

    async create(request: Request, response: Response) {
        const repository = getCustomRepository(ComentarioRepository);
        const { valor, idPai, idReceita, idUsuario } = request.body;

        try {
            const usuarioService = new UsuarioService();
            const receitaService = new ReceitaService();

            const usuario = await usuarioService.find(parseInt(idUsuario));
            const receita = await receitaService.find(parseInt(idReceita));
            const comentarioPai = await repository.findOne({ id: idPai });

            const comentario = repository.create({
                usuario,
                receita,
                valor,
                comentarioPai
            });

            await repository.save(comentario);

            return response.status(201).json({ message: 'Comentário registrado com sucesso.' });

        } catch (e) {
            console.error(e);
            return response.status(400).json({ error: e });
        }
    }
}

export default ComentarioService;