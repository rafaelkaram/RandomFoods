import { Request, Response } from 'express';

import { NOTIFICACAO_COMENTARIO, NOTIFICACAO_AVALIACAO } from '../util/msg';
import util from '../util/util.ts';

class LogNotificacaoController {
  // Métodos das rotas
  async show(request: Request, response: Response) {

    const msg = util.getMessage(NOTIFICACAO_COMENTARIO, [ 'Cara', 'que', 'dahora' ]);

    return util.systrace(200, response, msg);
  }

}

export default  LogNotificacaoController;