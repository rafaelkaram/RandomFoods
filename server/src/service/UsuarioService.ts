import e, { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import crypto from 'crypto';

import { UsuarioRepository } from '../repository/UsuarioRepository';

import { Usuario } from "../entity/Usuario";

const factor = 'TADS';

class UsuarioService {
    // Métodos das rotas
    async index(request: Request, response: Response) {
        const repository = getCustomRepository(UsuarioRepository);

        const usuarios = await repository.findAll();

        return response.status(200).json(usuarios);
    }

    async validate(request: Request, response: Response) {
        const repository = getCustomRepository(UsuarioRepository);
        const { email, senha } = request.body;

        const user = await repository.findOne({ email });

        if (user) {
            const hash = crypto.createHmac('sha256', senha)
                .update(factor)
                .digest('hex');

            if (user.senha === hash) {
                return response.status(200).json(user);
            }
        }

        return response.status(400).json({ error: 'Usuario ou senha inválidos!'});
    }

    async create(request: Request, response: Response) {
        const repository = getCustomRepository(UsuarioRepository);
        const { nome, email, senha } = request.body;

        const hash = crypto.createHmac('sha256', senha)
            .update(factor)
            .digest('hex');

        const usuario = repository.create({
            nome,
            email,
            senha: hash
        });

        await repository.save(usuario);

        return response.status(201).json({ message: 'Usuário criado com sucesso.' });
    }

    async createBulk(request: Request, response: Response) {
        const repository = getCustomRepository(UsuarioRepository);
        const usuarios = request.body;

        usuarios.map(async (data: any) => {
            const { nome, email, senha } = data;
            const hash = crypto.createHmac('sha256', senha)
                .update(factor)
                .digest('hex');

            const usuario = repository.create({
                nome,
                email,
                senha: hash
            });

            await repository.save(usuario);
        });

        return response.status(201).json({ message: `${ usuarios.length } usuários criados com sucesso.` });
    }

    async remove(request: Request, response: Response) {
        const repository = getCustomRepository(UsuarioRepository);
        const { id } = request.params;
        const userId = request.headers.authorization;

        const usuario = await repository.findOne({ id: parseInt(id) });

        if (userId != usuario?.id) {
            return response.status(401).json({ error: 'Operação não permitida.' });
        }

        await repository.remove([ <Usuario> usuario ]);

        return response.status(204).send();
    }

    // Métodos internos
    async fetch(id: number): Promise<Usuario> {
        const repository = getCustomRepository(UsuarioRepository);
        const usuario = await repository.findOne({ id });

        if (!usuario) {
            throw 'Usuário não encontrado';
        }

        return usuario;
    }
}

export default UsuarioService;