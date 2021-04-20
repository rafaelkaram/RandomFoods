import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { ReceitaRepository } from '../repository/ReceitaRepository';

import AvaliacaoService from './AvaliacaoService';
import CategoriaService from './CategoriaService';
import IngredienteService from './IngredienteService';
import MidiaService from './MidiaService';
import ReceitaIngredienteService from './ReceitaIngredienteService';
import UnidadeService from './UnidadeService';
import UsuarioService from './UsuarioService';

import { Receita, Tipo } from '../entity/Receita';
import { ReceitaIngrediente } from '../entity/ReceitaIngrediente';

import receitaView from '../view/ReceitaView';
import ReceitaFiltroView from '../view/ReceitaFiltroView';

import Util from '../util/Util';

class ReceitaService {
    // Métodos das rotas
    async index(request: Request, response: Response) {
        const repository = getCustomRepository(ReceitaRepository);

        const receitas = await repository.find({
            relations: ['usuario', 'ingredientesReceita', 'categorias', 'midias'],
            order: {
                dataCadastro: 'ASC'
            }
        });

        return response.status(200).json(receitas);
    }

    async fetch(request: Request, response: Response) {
        const repository = getCustomRepository(ReceitaRepository);

        const { id } = request.params;

        try {
            const receitaIngredienteService = new ReceitaIngredienteService();
            const avaliacaoService = new AvaliacaoService();
            const midiaService = new MidiaService();

            const receita = await repository.findOne({
                relations: ['usuario', 'categorias', 'midias'],
                where: {
                    id: parseInt(id)
                }
            });

            if (!receita) {
                return response.status(400).json({ error: 'Receita não encontrada.' });
            }
            const ingredientes = await receitaIngredienteService.findReceita(receita);

            if (!ingredientes) {
                return response.status(400).json({ error: 'Nenhum ingrediente para a receita.' });
            }

            const avaliacao = await avaliacaoService.countVotes(parseInt(id));
            const midias = await midiaService.findByReceita(parseInt(id));

            return response.status(200).json(receitaView.render(receita, ingredientes, midias, avaliacao));

        } catch (e) {
            console.error(e);

            return response.status(400).json({ error: e });
        }
    }

    async create(request: Request, response: Response) {
        const repository = getCustomRepository(ReceitaRepository);
        const { nome, descricao, tipo, ingredientes, categorias } = request.body;

        const user = request.headers.authorization;

        if (!user) {
            return response.status(400).json({ error: 'Usuário não encontrado.' });
        }

        try {
            const usuarioService = new UsuarioService();
            const unidadeService = new UnidadeService();
            const categoriaService = new CategoriaService();
            const ingredienteService = new IngredienteService();
            const receitaIngredienteService = new ReceitaIngredienteService();

            const usuario = await usuarioService.find(parseInt(user));

            const receita = repository.create({
                nome,
                descricao,
                tipo,
                usuario
            });

            await repository.save(receita);

            for (var key in ingredientes) {
                const { quantidade, idUnidade, idIngrediente } = ingredientes[key];

                const unidade = await unidadeService.findById(idUnidade);
                const ingrediente = await ingredienteService.findById(idIngrediente);

                const receitaIngrediente = new ReceitaIngrediente();
                receitaIngrediente.unidade = unidade;
                receitaIngrediente.quantidade = quantidade;
                receitaIngrediente.ingrediente = ingrediente;
                receitaIngrediente.receita = receita;

                await receitaIngredienteService.insertByRecipe(receitaIngrediente)
            }

            await categoriaService.insertByRecipe(categorias, receita);

            return response.status(201).json({ message: 'Receita cadastrada com sucesso.' });

        } catch (e) {
            console.error(e);
            return response.status(400).json({ error: e });
        }
    }

    async findByUser(request: Request, response: Response) {
        const repository = getCustomRepository(ReceitaRepository);

        const { idUsuario } = request.params;

        try {
            const usuarioService = new UsuarioService();
            const usuario = await usuarioService.find(parseInt(idUsuario));

            const receitas = await repository.findOne({ usuario });

            return response.status(200).json(receitas);

        } catch (e) {
            console.error(e);
            return response.status(400).json({ error: e });
        }
    }

    async findMatches(request: Request, response: Response) {
        const repository = getCustomRepository(ReceitaRepository);

        const { ids } = request.query;

        if (!ids) {
            return Util.syserror(400, response, 'A requisição precisa de ingredientes');
        }

        const { derivadoLeite } = request.query;

        const { gluten } = request.query;

        try {
            const receitaIngredienteService = new ReceitaIngredienteService();

            const idsMatchesPerfeitos = await receitaIngredienteService.findPerfectMatch(ids, derivadoLeite, gluten);

            const matchesPerfeitos = []

            const avaliacaoService = new AvaliacaoService();

            if (idsMatchesPerfeitos.length > 0) {
                const receitasMatchesPerfeitos = await repository.findByFiltro(idsMatchesPerfeitos);

                for (let key in receitasMatchesPerfeitos) {
                    const receita = receitasMatchesPerfeitos[key];
                    const avaliacao = await avaliacaoService.countVotes(receita.id);
                    const filter = ReceitaFiltroView.render(receita, avaliacao);
                    matchesPerfeitos.push(filter);
                }
            }
            const idsReceitaMatchesParciais = await receitaIngredienteService.findPartialMatch(ids, derivadoLeite, gluten);

            const matchesParciais = []

            if (idsReceitaMatchesParciais.length > 0) {
                const receitasMatchesParciais = await repository.findByFiltro(idsReceitaMatchesParciais)

                for (let key in receitasMatchesParciais) {
                    const receita = receitasMatchesParciais[key];
                    const avaliacao = await avaliacaoService.countVotes(receita.id);
                    const filter = ReceitaFiltroView.render(receita, avaliacao);
                    matchesParciais.push(filter);
                }
            }
            const matches = {
                matchesPerfeitos: matchesPerfeitos,
                matchesParciais: matchesParciais
            };

            return Util.systrace(200, response, matches);

        } catch (e) {
            Util.syserror(400, response, e);
        }
    }

    async countTypeByUserId(request: Request, response: Response) {
        const repository = getCustomRepository(ReceitaRepository);

        const { id } = request.params;
        const id_usuario = parseInt(id);

        const tipos = await repository.countTypeByUserId(id_usuario);

        return response.status(200).json(tipos);
    }

    async findTypeRecipe(request: Request, response: Response) {

        const tipos= Object.keys(Tipo);

        return response.status(200).json(tipos);
    }

    // Métodos internos
    async find(id: number): Promise<Receita> {
        const repository = getCustomRepository(ReceitaRepository);

        const receita = await repository.findOne({ id });

        if (!receita) {
            throw 'Receita não encontrada';
        }

        return receita;
    }

    async findByIds(ids: number[]): Promise<Receita[]> {
        const repository = getCustomRepository(ReceitaRepository);

        const receitas = await repository.findByIds(ids);

        if (!receitas) {
            throw 'Nenhuma receita encontrada';
        }

        return receitas;
    }



    async insert(nome: string, descricao: string, tipo: Tipo, usuarioStr?: string): Promise<Receita> {
        const repository = getCustomRepository(ReceitaRepository);

        try {
            const usuarioService = new UsuarioService();

            const usuario = await usuarioService.findByLoginOrEmail(usuarioStr);

            const receita = repository.create({
                nome,
                descricao,
                tipo,
                usuario
            });

            await repository.save(receita);

            return receita;
        } catch (err) {
            throw err;
        }
    }
}

export default ReceitaService;