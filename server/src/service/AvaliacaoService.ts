import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { AvaliacaoRepository } from '../repository/AvaliacaoRepository';

import ReceitaService from './ReceitaService';
import UsuarioService from './UsuarioService';

import { Avaliacao } from '../entity/Avaliacao';

class AvaliacaoService {
    // Métodos das rotas
    async index(request: Request, response: Response) {
        const repository = getCustomRepository(AvaliacaoRepository);

        const avaliacoes = await repository.findAll();

        return response.status(200).json(avaliacoes);
    }

    async findVoted(request: Request, response: Response){
        const repository = getCustomRepository(AvaliacaoRepository);

        const { id } = request.params;
        const id_usuario = parseInt(id);

        const avaliacoes = await repository.findByUserId(id_usuario);

        return response.status(200).json(avaliacoes);
    }

    async create(request: Request, response: Response) {
        const repository = getCustomRepository(AvaliacaoRepository);

        const { idReceita, idUsuario, valor } = request.body;

        try {
            const usuarioService = new UsuarioService();
            const receitaService = new ReceitaService();

            const usuario = await usuarioService.fetch(parseInt(idUsuario));
            const receita = await receitaService.fetch(parseInt(idReceita));

            const avaliacao = repository.create({
                receita,
                usuario,
                nota: valor,
            });

            await repository.save(avaliacao);

            return response.status(201).json({ message: 'Avaliação registrada com sucesso.' });

        } catch (e) {
            console.error(e);
            return response.status(400).json({ error: e });
        }
    }

    async remove(request: Request, response: Response) {
        const repository = getCustomRepository(AvaliacaoRepository);

        const { id } = request.params;
        const usuarioId = parseInt(<string> request.headers.authorization);

        const avaliacao = await repository.findOne({ id: parseInt(id) });

        if (usuarioId !== avaliacao?.usuario.id) {
            return response.status(401).json({ error: 'Ação não permitida.' });
        }

        await repository.remove([ <Avaliacao> avaliacao ]);

        return response.status(204).send();
    }
}

export default AvaliacaoService;