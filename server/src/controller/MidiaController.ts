import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import fs from 'fs';
import path from 'path';
import util from '../util/util';

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
        const repository = getCustomRepository(MidiaRepository);

        const { idReceita } = request.body as { idReceita: string | undefined};
        const midias = request.files as Express.Multer.File[];

        if (!idReceita) {
            midias.map(midia => {
                const nomeArquivo: string = midia.filename;

                console.log(`Removendo arquivo ${ nomeArquivo }.\nTipo de arquivo inválido`);
                fs.unlink(path.join(util.getPath('temp'), nomeArquivo), (err) => {
                    if (err) throw err;
                });
            });
            return util.syserror(400, response, 'Receita não encontrada!');
        } else if (!midias) {
            return util.syserror(400, response, 'Nenhuma mídia encontrada!');
        }

        const receitaController = new ReceitaController();

        const receita: Receita = await receitaController.find(parseInt(idReceita));

        const buffer: string = util.encryptMidia(idReceita);

        midias.map(async data => {
            const nomeArquivo = data.filename;
            const isExtensao = util.isExtensao(nomeArquivo, [ 'png', 'mp4' ]);

            if (!isExtensao) {
                console.log(`Removendo arquivo ${ nomeArquivo }.\nTipo de arquivo inválido`);
                fs.unlink(path.join(util.getPath('temp'), nomeArquivo), (err) => {
                    if (err) throw err;
                });
            } else {
                const extensao: string | undefined = nomeArquivo.split('.').pop();

                const midia = new Midia(util.moveFile('midia', buffer, nomeArquivo), Tipo.VIDEO, receita);

                if (extensao === 'png') {
                    midia.tipo = Tipo.FOTO;
                }

                await midia.save();
            }
        });

        return util.systrace(201, response, 'Midias salvas com sucesso.');
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