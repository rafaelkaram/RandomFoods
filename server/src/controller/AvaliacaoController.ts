import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { AvaliacaoRepository } from '../repository/AvaliacaoRepository';

import { Avaliacao } from '../model/Avaliacao';
import { Receita } from '../model/Receita';

class AvaliacaoController {
    // Métodos internos
    async countVotes(id: number): Promise<{ nota: number, qtdeNotas: number}> {
        const repository = getCustomRepository(AvaliacaoRepository);

        const avaliacao = await repository.findByReceitaId(id);

        return avaliacao;
    }
}

export default AvaliacaoController;