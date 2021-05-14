import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import util from '../util/util';

import { ReceitaRepository } from '../repository/ReceitaRepository';

import AvaliacaoController from './AvaliacaoController';
import IngredienteController from './IngredienteController';
import LogNotificacaoController from './LogNotificacaoController';
import MedidaController from './MedidaController';
import MidiaController from './MidiaController';
import ReceitaIngredienteController from './ReceitaIngredienteController';
import UnidadeController from './UnidadeController';
import UsuarioController from './UsuarioController';

import { Categoria, Tipo as TipoCategoria } from '../model/Categoria';
import { Ingrediente } from '../model/Ingrediente';
import { Medida } from '../model/Medida';
import { Midia } from '../model/Midia';
import { Receita, Tipo } from '../model/Receita';
import { ReceitaIngrediente } from '../model/ReceitaIngrediente';
import { Usuario } from '../model/Usuario';

import receitaView from '../view/ReceitaView';

class ReceitaController {
    // Métodos das rotas
    async countTypeByUserId(request: Request, response: Response) {
        const repository = getCustomRepository(ReceitaRepository);

        const { id } = request.params;
        const usuarioId = parseInt(id);

        const tipos = await repository.countTypeByUserId(usuarioId);

        return response.status(200).json(tipos);
    }

    // Métodos internos
    async index(request: Request, response: Response) {
        const repository = getCustomRepository(ReceitaRepository);

        const receitas = await repository.find({
            relations: [ 'usuario', 'midias', 'categorias' ],
            order: {
                dataCadastro: 'ASC'
            }
        });

        const avaliacaoController = new AvaliacaoController();

        const receitasList = receitas.map(async receita => {
            const id = receita.id;
            const avaliacao: { nota: number, qtdeNotas: number } = await avaliacaoController.countVotes(id);
            const midias: Midia[] = receita.midias.filter(midia => midia.thumbnail);

            if (receita)
                return receitaView.renderSimple(receita, avaliacao, midias.length > 0 ? midias[0] : undefined);
        })

        return util.systrace(200, response, receitasList);
    }

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

        const tipos= Object.keys(Tipo);

        return response.status(200).json(tipos);
    }

    async fetch(request: Request, response: Response) {
        const repository = getCustomRepository(ReceitaRepository);

        const { id } = request.params;

        try {
            const receitaIngredienteController = new ReceitaIngredienteController();
            const avaliacaoController = new AvaliacaoController();
            const midiaController = new MidiaController();
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
            const midias: Midia[] = await midiaController.findByReceita(parseInt(id));
            const qtdeLogs: number = await logController.countNotRead(receita.usuario);

            return response.status(200).json(receitaView.render(receita, ingredientes, midias, avaliacao, qtdeLogs));

        } catch (e) {
            console.error(e);

            return response.status(400).json({ error: e });
        }
    }

    async findMatches(request: Request, response: Response) {
        const { ids, tempoPreparo, derivadoLeite, gluten } = request.query as { ids: string[], tempoPreparo: string, derivadoLeite: string, gluten: string };

        const rIController = new ReceitaIngredienteController();

        const glutenBoolean: boolean = util.getBoolean2(gluten && <string> gluten);
        const derivadoLeiteBoolean: boolean = util.getBoolean2(derivadoLeite && <string> derivadoLeite);
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

            return util.systrace(200, response, { matchesPerfeitos, matchesParciais });

        } catch (e) {
            util.syserror(400, response, e);
        }
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