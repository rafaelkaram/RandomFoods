import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

import util from '../util/util';

import { UsuarioRepository } from '../repository/UsuarioRepository';

import { Usuario } from "../entity/Usuario";

const factor = 'TADS';

class UsuarioController {
    // Métodos internos
    async findByLoginOrEmail(data?: string): Promise<Usuario> {
        const repository = getCustomRepository(UsuarioRepository);

        let usuario = null;
        if (data)
            usuario = await repository.findByLoginOrEmail(data);

        if (!usuario)
            usuario = await repository.findOne({ id: 1 });

        return usuario;
    }
}

export default UsuarioController;