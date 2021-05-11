import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { MedidaRepository } from '../repository/MedidaRepository';

import { Medida } from '../model/Medida';
import { TipoUnidade } from '../model/TipoUnidade';

class MedidaController {
  // Metodos internos
  async import(dados: any) {
    const {
      nome,
      valor,
      tipoUnidade,
    } = dados as {
      nome: string,
      valor: number,
      tipoUnidade: string,
    };

    const tipo = <TipoUnidade> tipoUnidade.trim().toUpperCase();

    const medida = new Medida(nome.trim(), valor, tipo);

    await medida.save();
  }

  async findByType(nome: string, tipo?: TipoUnidade): Promise<Medida> {
    const repository = getCustomRepository(MedidaRepository);

    if (tipo)
      return await repository.findByType(nome.trim().toLowerCase(), tipo);

    return await repository.findByName(nome.trim().toLowerCase());
  }

  async findByName(nome: string, tipo?: TipoUnidade): Promise<Medida> {
    const repository = getCustomRepository(MedidaRepository);

    if (tipo)
      return await repository.findByType(nome.trim().toLowerCase(), tipo);

    return await repository.findByName(nome.trim().toLowerCase());
  }
}

export default MedidaController;