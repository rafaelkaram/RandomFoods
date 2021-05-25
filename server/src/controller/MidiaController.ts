import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import fs from 'fs';
import path from 'path';

import {
    encryptMidia,
    getPath,
    isExtensao,
    moveFile,
    syserror,
    systrace
} from '../util/util';

import { MidiaRepository } from '../repository/MidiaRepository';

import ReceitaController from './ReceitaController';

import { Midia, Tipo } from '../model/Midia';
import { Receita } from '../model/Receita';

class MidiaController {
    // Métodos das rotas
    async index(request: Request, response: Response) {
        const repository: MidiaRepository = getCustomRepository(MidiaRepository);

        const midias: Midia[] = await repository.findAll();

        return response.status(200).json(midias);
    }

    async create(request: Request, response: Response) {
        const { idReceita } = request.body as { idReceita: string | undefined};
        const midias = request.files as Express.Multer.File[];

        if (!idReceita) {
            midias.map(midia => {
                const nomeArquivo: string = midia.filename;

                console.log(`Removendo arquivo ${ nomeArquivo }.\nTipo de arquivo inválido`);
                fs.unlink(path.join(getPath('temp'), nomeArquivo), (err) => {
                    if (err) throw err;
                });
            });
            return syserror(400, response, 'Receita não encontrada!');
        } else if (!midias) {
            return syserror(400, response, 'Nenhuma mídia encontrada!');
        }

        const receitaController = new ReceitaController();

        const receita: Receita = await receitaController.find(parseInt(idReceita));

        const buffer: string = encryptMidia(idReceita);
        const midiaPath: string = getPath('midia', buffer);

        if (!fs.existsSync(midiaPath)) {
            fs.mkdirSync(midiaPath);
        }

        try {
            midias.map(async data => {
                const nomeArquivo = data.filename;
                const validFile = isExtensao(nomeArquivo, [ 'png', 'mp4' ]);

                if (!validFile) {
                    console.log(`Removendo arquivo ${ nomeArquivo }.\nTipo de arquivo inválido`);
                    fs.unlink(path.join(getPath('temp'), nomeArquivo), (err) => {
                        if (err) throw err;
                    });
                } else {
                    const extensao: string | undefined = nomeArquivo.split('.').pop();

                    const novoNome: string = Date.now().toString();
                    const midia: Midia = new Midia(novoNome, Tipo.VIDEO, receita);

                    if (extensao === 'png') {
                        midia.tipo = Tipo.FOTO;
                    }

                    moveFile(buffer, nomeArquivo, novoNome, midia.tipo);

                    await midia.save();
                }
            });
        } catch (err) {
            return syserror(400, response, 'Deu erro, não sei qual foi, mas deu erro');
        }

        return systrace(201, response, 'Midias salvas com sucesso.');
    }

    // Métodos internos
    async findByReceita(id: number): Promise<Midia[]> {
        const repository = getCustomRepository(MidiaRepository);

        const midias: Midia[] = await repository.findByReceita(id);

        return midias;
    }

    async findFirst(id: number): Promise<Midia> {
        const repository = getCustomRepository(MidiaRepository);

        const midias: Midia[] = await repository.findByReceita(id);

        midias.forEach(midia => {
            if (midia.tipo === Tipo.FOTO) return midia;
        });

        const receitaController = new ReceitaController();

        const receita = await receitaController.find(id);

        return new Midia('', Tipo.FOTO, receita);
    }
}

export default MidiaController;