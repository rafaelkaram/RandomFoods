import { Request, Response } from 'express';

import { NOTIFICACAO_COMENTARIO, NOTIFICACAO_AVALIACAO } from '../util/msg';
import util from '../util/util';

class LogNotificacaoController {
  // Métodos das rotas
  async show(request: Request, response: Response) {
    const { nome, tipo, cu } = request.body;

    const msg = util.getMessage(NOTIFICACAO_COMENTARIO, [ nome, tipo, cu ]);

    return util.systrace(200, response, msg);
  }

}

export default  LogNotificacaoController;