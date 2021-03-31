import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { ReceitaRepository } from '../repository/ReceitaRepository';

import UnidadeService from './UnidadeService';
import UsuarioService from './UsuarioService';
import CategoriaService from './CategoriaService';
import IngredienteService from './IngredienteService';
import ReceitaIngredienteService from './ReceitaIngredienteService';

import { Receita } from '../entity/Receita';
import { ReceitaIngrediente } from '../entity/ReceitaIngrediente';

class ReceitaService {
    // Métodos das rotas
    async index(request: Request, response: Response) {
        const repository = getCustomRepository(ReceitaRepository);

        const receitas = await repository.find({
            relations: [ 'usuario', 'ingredientesReceita', 'categorias', 'midias' ],
            order: {
                dataCadastro: 'ASC'
            }
        });

        return response.status(200).json(receitas);
    }

    async fetch(request: Request, response: Response) {
        const repository = getCustomRepository(ReceitaRepository);

        const { id } = request.params;

        const receita = await repository.findOne({ id: parseInt(id) });

        if (!receita) {
            throw 'Receita não encontrada';
        }

        return receita;
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

            const usuario = await usuarioService.fetch(parseInt(user));

            const receita = repository.create({
                nome,
                descricao,
                tipo,
                usuario
            });

            await repository.save(receita);

            const ingredienteList = [];

            for (var key in ingredientes) {
                const { quantidade, id_unidade, id_ingrediente } = ingredientes[key];

                const unidade = await unidadeService.findById(id_unidade);
                const ingrediente = await ingredienteService.findById(id_ingrediente);

                const receitaIngrediente = new ReceitaIngrediente();
                receitaIngrediente.unidade     = unidade;
                receitaIngrediente.quantidade  = quantidade;
                receitaIngrediente.ingrediente = ingrediente;
                receitaIngrediente.receita = receita;

                const result = await receitaIngredienteService.insertByRecipe(receitaIngrediente)

                ingredienteList.push(result);
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
            const usuario = await usuarioService.fetch(parseInt(idUsuario));

            const receitas = await repository.findOne({ usuario });

            return response.status(200).json(receitas);

        } catch (e) {
            console.error(e);
            return response.status(400).json({ error: e });
        }
    }

    async countTypeByUserId(request: Request, response: Response) {
        const repository = getCustomRepository(ReceitaRepository);

        const { id } = request.params;
        const id_usuario = parseInt(id);

        const tipos = await repository.countTypeByUserId(id_usuario);

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
}

export default ReceitaService;