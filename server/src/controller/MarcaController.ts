import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { MarcaRepository } from '../repository/MarcaRepository';

import ReceitaController from './ReceitaController';
import UsuarioController from './UsuarioController';

import { Marca } from '../model/Marca';
import { LogNotificacao } from '../model/LogNotificacao';
import { Receita } from '../model/Receita';
import { Usuario } from '../model/Usuario';

class MarcaController {
    // Métodos internos

}

export default MarcaController;