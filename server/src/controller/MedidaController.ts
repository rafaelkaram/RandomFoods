import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { MedidaRepository } from '../repository/MedidaRepository';

import { Medida } from '../model/Medida';
import { TipoUnidade, TipoUnidade as tipoUnidade } from '../model/TipoUnidade';

class MedidaController {
  // Metodos internos
  async import(dados: any) {
    const {
      Sigla,
      Valor,
      TipoUnidade,
    } = dados as {
      Sigla: string,
      Valor: number,
      TipoUnidade: tipoUnidade,
      };

    const medida = new Medida(Sigla, Valor, TipoUnidade);

    await medida.save();
  }

  async findByType(nome: string, tipo?: TipoUnidade): Promise<Medida> {
    const repository = getCustomRepository(MedidaRepository);

    if (tipo)
      return await repository.findByType(nome.toLowerCase(), tipo);

    return await repository.findByNome(nome.toLowerCase());
  }
}

export default MedidaController;