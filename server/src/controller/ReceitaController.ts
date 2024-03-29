import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import fs from 'fs';
import path from 'path';

import { ReceitaRepository } from '../repository/ReceitaRepository';

import AvaliacaoController from './AvaliacaoController';
import CategoriaController from './CategoriaController';
import ComentarioController from './ComentarioController';
import CurtidaController from './CurtidaController';
import IngredienteController from './IngredienteController';
import LogNotificacaoController from './LogNotificacaoController';
import MedidaController from './MedidaController';
import ReceitaIngredienteController from './ReceitaIngredienteController';
import SeguidorController from './SeguidorController';
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
import { Curtida } from '../model/Curtida';
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
            where: { ativa: true },
            relations: [ 'usuario', 'midias', 'categorias' ],
            order: { dataCadastro: 'ASC' }
        });

        const avaliacaoController = new AvaliacaoController();
        const comentarioController = new ComentarioController();
        const curtidaController = new CurtidaController();

        const receitasList = await Promise.all(receitas.map(async receita => {
            const id = receita.id;
            const comentarios: number = await comentarioController.count(receita);
            const curtidas: number = await curtidaController.count(receita);
            const avaliacao: { nota: number, qtdeNotas: number } = await avaliacaoController.countVotes(id);
            const midias: Midia[] = receita.midias.filter(midia => midia.thumbnail);

            if (receita)
                return receitaView.renderSimple(receita, curtidas, comentarios, avaliacao, midias.length > 0 ? midias[0] : undefined);
        }));

        return systrace(200, response, receitasList);
    }

    async create(request: Request, response: Response) {
        const idUsuario: number = request.idUsuario as number;
        const {
            nome,
            tipo,
            categorias,
            tempoPreparo,
            porcoes,
            descricao,
            ingredientes
        } = request.body as {
            nome: string,
            tipo: string,
            categorias: string[],
            tempoPreparo: string,
            porcoes: string,
            descricao: string,
            ingredientes: {
                id: string,
                unidade: string,
                quantidade: string,
            }[],
        };

        const arquivos = request.files as Express.Multer.File[];

        const ingredienteController = new IngredienteController();
        const medidaController = new MedidaController();
        const usuarioController = new UsuarioController();
        const unidadeController = new UnidadeController();

        const usuario: Usuario = await usuarioController.find(idUsuario);
        const receita: Receita = new Receita(nome, descricao, parseInt(tempoPreparo), parseInt(porcoes), <Tipo> tipo.trim().toUpperCase(), usuario);

        await receita.save();

        if (categorias && categorias.length > 0)
            await Promise.all(categorias.map(async nome => {
                const categoria: Categoria = new Categoria(<TipoCategoria> nome, receita);

                await categoria.save();
            }));

        await Promise.all(ingredientes.map(async item => {
            const ingrediente: Ingrediente = await ingredienteController.find(parseInt(item.id));
            const receitaIngrediente = new ReceitaIngrediente(ingrediente, receita);

            if (item.unidade) {
                const medida: Medida = await medidaController.findByType(item.unidade, ingrediente.tipoUnidade);
                receitaIngrediente.unidade = await unidadeController.find(medida, ingrediente);
            } else if (item.quantidade) {
                const unidades = await unidadeController.findSI2();
                receitaIngrediente.unidade = unidades[0];
            }

            if (item.quantidade) receitaIngrediente.quantidade = parseFloat(item.quantidade);

            receitaIngrediente.save();
        }));

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

        const idUsuario: number = request.idUsuario as number;

        const tipos = await repository.countTypeByUserId(idUsuario);

        return systrace(200, response, tipos);
    }

    async getTempoPreparo(request: Request, response: Response) {
        const repository = getCustomRepository(ReceitaRepository);

        const min = await repository.getTempoPreparo(true);
        const max = await repository.getTempoPreparo(false);


        return systrace(200, response, [ min, max ]);
    }

    async typeIndex(request: Request, response: Response) {

        const tipos = Object.values(Tipo);

        return response.status(200).json(tipos);
    }

    async fetch(request: Request, response: Response) {
        const repository = getCustomRepository(ReceitaRepository);

        const { id } = request.params;

        try {
            const receitaIngredienteController = new ReceitaIngredienteController();
            const avaliacaoController = new AvaliacaoController();
            const logController = new LogNotificacaoController();
            const curtidaController = new CurtidaController();

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

            const curtidas: Curtida[] = await curtidaController.find(receita);

            const avaliacao: { nota: number, qtdeNotas: number } = await avaliacaoController.countVotes(parseInt(id));
            const qtdeLogs: number = await logController.countNotRead(receita.usuario);

            return response.status(200).json(receitaView.render(receita, ingredientes, curtidas, avaliacao, qtdeLogs));

        } catch (e) {
            console.error(e);

            return response.status(400).json({ error: e });
        }
    }

    async findMatches(request: Request, response: Response) {
        const { ids, tempoPreparo, derivadoLeite, gluten, categorias, porcoes, tipo } = request.query as { ids: string[], tempoPreparo: string, derivadoLeite: string, gluten: string, categorias: string[], porcoes: string, tipo: string[] };

        const rIController = new ReceitaIngredienteController();

        const glutenBoolean: boolean = getBoolean2(gluten && <string> gluten);
        const derivadoLeiteBoolean: boolean = getBoolean2(derivadoLeite && <string> derivadoLeite);
        const tempo: number = tempoPreparo ? parseInt(tempoPreparo) : 0;
        const qtdePorcoes: number = porcoes ? parseInt(porcoes) : 0;

        const ids2: number[] = ids?.map((id: string) => {
            return parseInt(id);
        });

        try {
            console.log({ tempoPreparo: tempo, gluten: glutenBoolean, derivadoLeite: derivadoLeiteBoolean, ids: ids2, categorias, porcoes: qtdePorcoes, tipo });

            const { perfect, partial } = await rIController.findMatches({ tempoPreparo: tempo, gluten: glutenBoolean, derivadoLeite: derivadoLeiteBoolean, ids: ids2, categorias, porcoes: qtdePorcoes, tipo });
            const matchesPerfeitos: any[] = [];
            const matchesParciais: any[] = [];

            for (let key in perfect) {
                const id = perfect[key];
                const receita = await ReceitaController.buildReceita(id);
                matchesPerfeitos.push(receita);
            }
            for (let key in partial) {
                const id = partial[key];
                const receita = await ReceitaController.buildReceita(id);
                matchesParciais.push(receita);
            }

            return systrace(200, response, { matchesPerfeitos, matchesParciais });

        } catch (e) {
            syserror(400, response, e);
        }
    }

    async findHome(request: Request, response: Response) {
        const idUsuario: number = request.idUsuario as number;

        const curtidaController = new CurtidaController();
        const seguidorController = new SeguidorController();

        try {
            const listCurtidas: any[] = [];
            const listSeguidores: any[] = [];

            const curtidas = await curtidaController.findPorCurtidas();
            for (let key in curtidas) {
                const id = curtidas[key];
                const receita = await ReceitaController.buildReceita(id);
                listCurtidas.push(receita);
            }

            if (idUsuario && idUsuario !== 0) {
                const seguidores = await seguidorController.findPorSeguidos(idUsuario);
                await Promise.all(seguidores.map(async id => {
                    const receita = await ReceitaController.buildReceita(id);
                    listSeguidores.push(receita);
                }));
            }

            const sortedListSeguidores = listSeguidores.sort((a, b) => {
                const n = b.curtidas - a.curtidas;
                if (n !== 0) return n;
                return b.comentarios - a.comentarios;
            });

            return systrace(200, response, { listCurtidas, listSeguidores: sortedListSeguidores });
        } catch (e) {
            return syserror(400, response, e);
        }
    }

    async findByUsuario(request: Request, response: Response) {
        const repository = getCustomRepository(ReceitaRepository);
        const { id } = request.params as { id: string };

        const usuarioId = parseInt(id);

        try {
            const receitas: any[] = [];

            const usuarioController = new UsuarioController();
            const usuario: Usuario = await usuarioController.find(usuarioId);

            const list = await repository.find({
                select: [ 'id' ],
                where: [ { usuario, ativa: true } ],
                order: { dataCadastro: 'DESC' }
            });
            for (let key in list) {
                const item: { id: number } = list[key];
                const receita = await ReceitaController.buildReceita(item.id);
                receitas.push(receita);
            }

            return systrace(200, response, { receitas });

        } catch (e) {
            syserror(400, response, e);
        }
    }

    async findByCategorias(request: Request, response: Response) {
        const idUsuario: number = request.idUsuario as number;
        const { categoria } = request.query as { categoria: string };

        try {
            const categoriaController = new CategoriaController();

            const idReceitas: number[] = await categoriaController.findByCategoria(idUsuario, categoria);
            console.log(idReceitas);


            const receitas: any[] = [];
            await Promise.all(idReceitas.map(async id => {
                const receita = await ReceitaController.buildReceita(id);
                receitas.push(receita);
            }));

            return systrace(200, response, receitas);

        } catch (e) {
            syserror(400, response, e);
        }
    }

    async remove(request: Request, response: Response) {
        const repository = getCustomRepository(ReceitaRepository);

        const idUsuario: number = request.idUsuario as number;
        const { id } = request.params;

        const usuarioController = new UsuarioController();

        const usuario = await usuarioController.find(idUsuario);
        const receita = await repository.findOneOrFail({
            where: {
                id: parseInt(id), usuario
            }
        });
        receita.ativa = false;
        receita.save();

        return systrace(204, response);
    }

    // Métodos internos
    async import(dados: { nome: string, descricao: string, tempoPreparo: number, porcoes: number, tipo: string, usuario?: string },
        dadosIngrediente: { nomeIngrediente: string, unidade?: string, quantidade?: number }[],
        dadosCategoria: { categoria: string }[]) {

        const nome: string = dados.nome.trim();
        const descricao: string = dados.descricao.trim();
        const tempoPreparo: number = dados.tempoPreparo ? dados.tempoPreparo : 0;
        const porcoes: number = dados.porcoes ? dados.porcoes : 1;
        const tipo: Tipo = <Tipo> dados.tipo.trim().toUpperCase();
        const usuario: string | undefined = dados.usuario?.trim().toLowerCase();

        const ingredienteController = new IngredienteController();
        const medidaController = new MedidaController();
        const unidadeController = new UnidadeController();
        const usuarioController = new UsuarioController();

        const usuarioReceita = await usuarioController.findByLoginOrEmail(usuario);
        const receita = new Receita(nome, descricao, tempoPreparo, porcoes, tipo, usuarioReceita);

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

    async find(id: number): Promise<Receita> {
        const repository = getCustomRepository(ReceitaRepository);

        const receita: Receita = await repository.findOneOrFail({ id });

        if (!receita) {
            throw 'Receita não encontrada';
        }

        return receita;
    }

    async findByIdAndUser(id: number, idUsuario: number): Promise<Receita> {
        const repository = getCustomRepository(ReceitaRepository);

        const usuarioController = new UsuarioController();

        const usuario: Usuario = await usuarioController.find(idUsuario);
        const receita: Receita = await repository.findOneOrFail({
            where: {
                id,
                usuario
            }
        });

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
        const comentarioController = new ComentarioController();
        const curtidaController = new CurtidaController();

        const comentarios: number = await comentarioController.count(receita);
        const curtidas: number = await curtidaController.count(receita);
        const midias: Midia[] = receita.midias.filter(midia => midia.thumbnail);
        const avaliacao: { nota: number, qtdeNotas: number } = await avaliacaoController.countVotes(id);
        const receitaSimples = receitaView.renderSimple(receita, curtidas, comentarios, avaliacao, midias.length > 0 ? midias[0] : undefined);

        return receitaSimples;
    }
}

export default ReceitaController;