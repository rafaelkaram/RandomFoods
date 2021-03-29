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

    async index(request: Request, response: Response) {
        const repository = getCustomRepository(ReceitaRepository);

        const receitas = await repository.find({
            relations: [ 'usuario' ],
            order: {
                dataCadastro: 'ASC'
            }
        });

        return response.status(200).json(receitas);
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

        const { idUsuario } = request.body;

        try {
            const usuarioService = new UsuarioService();
            const usuario = await usuarioService.fetch(idUsuario);

            const receitas = await repository.findOne({ usuario });

            return response.status(200).json(receitas);

        } catch (e) {
            console.error(e);
            return response.status(400).json({ error: e });
        }
    }

    async findPerfectMatch(request: Request, response: Response) {
        const repository = getCustomRepository(ReceitaRepository);

        //const { ingredientes } = request.params.query;

        //const receitas =

        /*const idsR = await connection('receita_ingrediente')
            .whereIn('id_ingrediente', ids)
            .select('id_receita');*/

       /* const idsReceita = await connection.raw(`
        SELECT
            id_receita
        FROM
            receita_ingrediente
        WHERE
            id_ingrediente IN (${ingredientes})
        GROUP BY
            id_receita
        HAVING count(*) = ${ingredientes.length}`); */

        //pode ser util no futuro
        /*const receitas = await connection('receita')
            .innerJoin('receita_ingrediente', 'receita_ingrediente.id_receita', '=', 'receita.id')
            .innerJoin('ingrediente', 'receita_ingrediente.id_ingrediente', '=', 'ingrediente.id')
            .whereIn('ingrediente.id', idsReceita)
            .select('receita.*');*/
        /*

        const ids = []
        for (var key in idsReceita.rows) {
            ids.push(idsReceita.rows[key].id_receita)
        }

        const receitas = await connection('receita')
            .whereIn('id', ids)
            .select('*')

        const resp = [];

        for (var key in receitas) {
            const obj = receitas[key];

            const receita = await module.exports.findReceita(obj);

            resp.push(receita);
        }

        return response.json(resp);*/
    }

    async countTypeByUserId(request: Request, response: Response) {
        const repository = getCustomRepository(ReceitaRepository);

        const { id } = request.params;
        const id_usuario = parseInt(id);

        const tipos = await repository.countTypeByUserId(id_usuario);

        return response.status(200).json(tipos);
    }

    // Métodos internos
    async fetch(id: number): Promise<Receita> {
        const repository = getCustomRepository(ReceitaRepository);

        const receita = await repository.findOne({ id });

        if (!receita) {
            throw 'Receita não encontrada';
        }

        return receita;
    }
}

export default ReceitaService;