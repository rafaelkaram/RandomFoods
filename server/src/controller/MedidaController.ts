import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { MedidaRepository } from '../repository/MedidaRepository';

import { Medida } from '../model/Medida';
import { TipoUnidade as tipoUnidade } from '../model/TipoUnidade';

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

  async findByIngredient(sigla: string, ingrediente?: string): Promise<Medida> {
    const repository = getCustomRepository(MedidaRepository);

    if (ingrediente)
      return await repository.findByIngredient(sigla.toLowerCase(), ingrediente.toLowerCase());

    return await repository.findBySigla(sigla.toLowerCase());
  }
}

export default MedidaController;