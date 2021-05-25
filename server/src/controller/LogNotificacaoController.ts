import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { NOTIFICACAO_COMENTARIO, NOTIFICACAO_AVALIACAO } from '../util/msg';

import { getMessage, systrace } from '../util/util';

import { Usuario } from '../model/Usuario';
import { LogNotificacaoRepository } from '../repository/LogNotificacaoRepository';

class LogNotificacaoController {
  // Métodos das rotas
	async show(request: Request, response: Response) {
		const { nome, tipo, cu } = request.body;

		const msg = getMessage(NOTIFICACAO_COMENTARIO, [ nome, tipo, cu ]);
		return systrace(200, response, msg);
	}

	// Métodos internos
	async countNotRead(usuario: Usuario): Promise<number> {
		const repository = getCustomRepository(LogNotificacaoRepository);

		const qtde: number = await repository.countNotRead(usuario.id);
		return qtde;
	}

}

export default  LogNotificacaoController;