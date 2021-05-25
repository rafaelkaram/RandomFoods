import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import fs from 'fs';
import path from 'path';

import { ReceitaRepository } from '../repository/ReceitaRepository';

import AvaliacaoController from './AvaliacaoController';
import IngredienteController from './IngredienteController';
import LogNotificacaoController from './LogNotificacaoController';
import MedidaController from './MedidaController';
import ReceitaIngredienteController from './ReceitaIngredienteController';
import UnidadeController from './UnidadeController';
import UsuarioController from './UsuarioController';

import {
    encryptMidia,
    getBoolean2,
    getPath,
    isExtensao,
    moveFile,
    syserror,
    systrace
} from '../util/util';
import { Categoria, Tipo as TipoCategoria } from '../model/Categoria';
import { Ingrediente } from '../model/Ingrediente';
import { Medida } from '../model/Medida';
import { Midia, Tipo as TipoMidia } from '../model/Midia';
import { Receita, Tipo } from '../model/Receita';
import { ReceitaIngrediente } from '../model/ReceitaIngrediente';
import { Usuario } from '../model/Usuario';

import receitaView from '../view/ReceitaView';

class ReceitaController {
    // Métodos das rotas
    async index(request: Request, response: Response) {
        const repository = getCustomRepository(ReceitaRepository);

        const receitas = await repository.find({
            relations: [ 'usuario', 'midias', 'categorias' ],
            order: {
                dataCadastro: 'ASC'
            }
        });

        const avaliacaoController = new AvaliacaoController();

        const receitasList = await Promise.all(receitas.map(async receita => {
            const id = receita.id;
            const avaliacao: { nota: number, qtdeNotas: number } = await avaliacaoController.countVotes(id);
            const midias: Midia[] = receita.midias.filter(midia => midia.thumbnail);

            if (receita)
                return receitaView.renderSimple(receita, avaliacao, midias.length > 0 ? midias[0] : undefined);
        }));

        return systrace(200, response, receitasList);
    }

    async create(request: Request, response: Response) {
        const { teste, nome, tempoPreparo, descricao, tipo, usuarioId } = request.body as { teste?: string, nome: string, tempoPreparo: string, descricao: string, tipo: Tipo, usuarioId: string };
        const arquivos = request.files as Express.Multer.File[];

        if (teste === 'sim') return systrace(200, response, 'Recebi as info bro, deu boa');

        const usuarioController = new UsuarioController();

        const usuario: Usuario = await usuarioController.find(parseInt(usuarioId));
        const receita: Receita = new Receita(nome, descricao, parseInt(tempoPreparo), tipo, usuario);

        await receita.save();

        const buffer: string = encryptMidia(receita.id.toString());
        const midiaPath: string = getPath('midia', buffer);

        if (!fs.existsSync(midiaPath)) {
            fs.mkdirSync(midiaPath);
        }

        let isThumbnail = true;

        await Promise.all(arquivos.map(async arquivo => {
            const nomeArquivo = arquivo.filename;
            const validFile = isExtensao(nomeArquivo, [ 'png', 'mp4' ]);

            if (!validFile) {
                console.log(`Removendo arquivo ${ nomeArquivo }.\nTipo de arquivo inválido`);
                fs.unlink(path.join(getPath('temp'), nomeArquivo), (err) => {
                    if (err) throw err;
                });
            } else {
                const extensao: string | undefined = nomeArquivo.split('.').pop();

                const novoNome: string = Date.now().toString();
                const midia: Midia = new Midia(novoNome, TipoMidia.VIDEO, receita);

                if (extensao === 'png') {
                    midia.tipo = TipoMidia.FOTO;
                    if (isThumbnail) {
                        isThumbnail = false;
                        midia.thumbnail = true;
                    }
                }

                moveFile(buffer, nomeArquivo, novoNome, midia.tipo);

                await midia.save();
            }
        }));

        return systrace(201, response, receita.id);
    }

    async countTypeByUserId(request: Request, response: Response) {
        const repository = getCustomRepository(ReceitaRepository);

        const { id } = request.params;
        const usuarioId = parseInt(id);

        const tipos = await repository.countTypeByUserId(usuarioId);

        return systrace(200, response, tipos);
    }

    // Métodos internos
    async import(dados: { nome: string, descricao: string, tempoPreparo: number, tipo: string, usuario?: string },
        dadosIngrediente: { nomeIngrediente: string, unidade?: string, quantidade?: number }[],
        dadosCategoria: { categoria: string }[]) {

        const nome: string = dados.nome.trim();
        const descricao: string = dados.descricao.trim();
        const tempoPreparo: number = dados.tempoPreparo ? dados.tempoPreparo : 0;
        const tipo: Tipo = <Tipo> dados.tipo.trim().toUpperCase();
        const usuario: string | undefined = dados.usuario?.trim().toLowerCase();

        const ingredienteController = new IngredienteController();
        const medidaController = new MedidaController();
        const unidadeController = new UnidadeController();
        const usuarioController = new UsuarioController();

        const usuarioReceita = await usuarioController.findByLoginOrEmail(usuario);
        const receita = new Receita(nome, descricao, tempoPreparo, tipo, usuarioReceita);

        await receita.save();

        if (dadosCategoria && dadosCategoria.length > 0) {
            for (let k in dadosCategoria) {
                const nomeCategoria = <TipoCategoria> dadosCategoria[k].categoria.trim().toUpperCase();

                const categoria = new Categoria(nomeCategoria, receita);
                await categoria.save();
            }
        }

        for (let j in dadosIngrediente) {
            const dado = dadosIngrediente[j];

            const nomeIngrediente = dado.nomeIngrediente.trim().toLowerCase();
            const nomeMedida = dado.unidade?.trim().toLowerCase();
            const quantidade = dado.quantidade;

            const ingrediente: Ingrediente = await ingredienteController.findByName(nomeIngrediente);
            const receitaIngrediente: ReceitaIngrediente = new ReceitaIngrediente(ingrediente, receita);

            if (!quantidade && !ingrediente.semMedida) {
                throw Error(`Ingrediente ${ ingrediente.nome } não aceita quantidades nulas`);
            } else if (nomeMedida) {
                const medida: Medida = await medidaController.findByType(nomeMedida, ingrediente.tipoUnidade);
                receitaIngrediente.unidade = await unidadeController.find(medida, ingrediente);
            } else {
                const unidades = await unidadeController.findSI2();
                receitaIngrediente.unidade = unidades[0];
            }

            if (quantidade) receitaIngrediente.quantidade  = quantidade;

            await receitaIngrediente.save();
        }
    }

    async typeIndex(request: Request, response: Response) {

        const tipos = Object.keys(Tipo);

        return response.status(200).json(tipos);
    }

    async fetch(request: Request, response: Response) {
        const repository = getCustomRepository(ReceitaRepository);

        const { id } = request.params;

        try {
            const receitaIngredienteController = new ReceitaIngredienteController();
            const avaliacaoController = new AvaliacaoController();
            const logController = new LogNotificacaoController();

            const receita = await repository.findOne({
                relations: ['usuario', 'categorias', 'midias'],
                where: {
                    id: parseInt(id)
                }
            });

            if (!receita) {
                return response.status(400).json({ error: 'Receita não encontrada.' });
            }

            const ingredientes: ReceitaIngrediente[] = await receitaIngredienteController.findReceita(receita);

            if (!ingredientes) {
                return response.status(400).json({ error: 'Nenhum ingrediente para a receita.' });
            }

            const avaliacao: { nota: number, qtdeNotas: number } = await avaliacaoController.countVotes(parseInt(id));
            const qtdeLogs: number = await logController.countNotRead(receita.usuario);

            return response.status(200).json(receitaView.render(receita, ingredientes, avaliacao, qtdeLogs));

        } catch (e) {
            console.error(e);

            return response.status(400).json({ error: e });
        }
    }

    async findMatches(request: Request, response: Response) {
        const { ids, tempoPreparo, derivadoLeite, gluten } = request.query as { ids: string[], tempoPreparo: string, derivadoLeite: string, gluten: string };

        const rIController = new ReceitaIngredienteController();

        const glutenBoolean: boolean = getBoolean2(gluten && <string> gluten);
        const derivadoLeiteBoolean: boolean = getBoolean2(derivadoLeite && <string> derivadoLeite);
        const tempo: number = tempoPreparo ? parseInt(tempoPreparo) : 0;

        const ids2: number[] = ids?.map((id: string) => {
            return parseInt(id);
        });

        try {
            console.log({ tempoPreparo: tempo, gluten: glutenBoolean, derivadoLeite: derivadoLeiteBoolean, ids: ids2 });

            const { perfect, partial } = await rIController.findMatches({ tempoPreparo: tempo, gluten: glutenBoolean, derivadoLeite: derivadoLeiteBoolean, ids: ids2 });
            const matchesPerfeitos: any[] = [];
            const matchesParciais: any[] = [];

            await Promise.all(perfect.map(async id => {
                const receita = await ReceitaController.buildReceita(id);
                matchesPerfeitos.push(receita);
            }));
            await Promise.all(partial.map(async id => {
                const receita = await ReceitaController.buildReceita(id);
                matchesParciais.push(receita);
            }));

            return systrace(200, response, { matchesPerfeitos, matchesParciais });

        } catch (e) {
            syserror(400, response, e);
        }
    }

    async remove(request: Request, response: Response) {
        const repository = getCustomRepository(ReceitaRepository);
        const { id } = request.params;

        const receita = await repository.findOneOrFail({ id: parseInt(id) });
        receita.ativa = false;
        receita.save();

        return systrace(204, response);
    }

    // Métodos internos
    async find(id: number): Promise<Receita> {
        const repository = getCustomRepository(ReceitaRepository);

        const receita: Receita = await repository.findOneOrFail({ id });

        if (!receita) {
            throw 'Receita não encontrada';
        }

        return receita;
    }

    async findByNameAndUser(nome: string, usuario: Usuario): Promise<Receita> {
        const repository = getCustomRepository(ReceitaRepository);

        const receita: any = await repository.findByNameAndUser(nome.trim().toLowerCase(), usuario);

        return receita;
    }

    static async buildReceita (id: number) {
        const repository = getCustomRepository(ReceitaRepository);

        const receita: Receita = await repository.findOneOrFail({
            relations: [ 'midias', 'categorias', 'usuario' ],
            where: {
                id
            }
        });

        const avaliacaoController = new AvaliacaoController();

        const midias: Midia[] = receita.midias.filter(midia => midia.thumbnail);
        const avaliacao: { nota: number, qtdeNotas: number } = await avaliacaoController.countVotes(id);
        const receitaSimples = receitaView.renderSimple(receita, avaliacao, midias.length > 0 ? midias[0] : undefined);

        return receitaSimples;
    }
}

export default ReceitaController;