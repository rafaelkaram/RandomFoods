import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import fs from 'fs';
import path from 'path';
import Util from '../util/Util';

import { MidiaRepository } from '../repository/MidiaRepository';

import ReceitaService from './ReceitaService';

import { Midia, Tipo } from '../entity/Midia';
import { Receita } from '../entity/Receita';

class MidiaService {
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

                console.log(`Removendo arquivo ${ nomeArquivo }.`);
                const midiaPath: string = Util.getPath('midia', nomeArquivo);
                fs.unlink(path.join(midiaPath, nomeArquivo), (err) => {
                    if (err) throw err;
                });
            });
            return response.status(400).json({ error: 'Receita não encontrada!' });
        } else if (!midias) {
            return response.status(400).json({ error: 'Nenhuma mídia encontrada!' });
        }

        const receitaService = new ReceitaService();

        const receita: Receita = await receitaService.find(parseInt(idReceita));

        midias.map(async data => {
            const nomeArquivo = data.filename;
            const isFoto = Util.isExtensao(nomeArquivo, [ 'jpg', 'jpeg', 'png' ]);
            const isVideo = Util.isExtensao(nomeArquivo, [ 'mp4', 'mkv', 'webp' ]);
            const folder = Util.getFolderName(nomeArquivo);
            const midiaPath = Util.getPath('midia', nomeArquivo)

            if (!(isFoto || isVideo)) {
                console.log(`Removendo arquivos.\nImportação não concluída.`);
                fs.unlink(path.join(midiaPath, nomeArquivo), (err) => {
                if (err) throw err;
            });
            }

            const midia: Midia = repository.create({
                path: path.join(folder, nomeArquivo),
                tipo: isFoto ? Tipo.FOTO : Tipo.VIDEO,
                receita
            });

            await repository.save(midia);
        });


        return response.status(201).json({ message: 'Midias salvas com sucesso.' });
    }

    // Métodos internos
    async findByReceita(id: number): Promise<Midia[]> {
        const repository = getCustomRepository(MidiaRepository);

        const midias = await repository.findByReceita(id);

        return midias;
    }
}

export default MidiaService;