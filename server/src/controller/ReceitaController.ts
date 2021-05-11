import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { ReceitaRepository } from '../repository/ReceitaRepository';

import IngredienteController from './IngredienteController';
import MedidaController from './MedidaController';
import UnidadeController from './UnidadeController';
import UsuarioController from './UsuarioController';

import { Categoria, Tipo as TipoCategoria } from '../model/Categoria';
import { Ingrediente } from '../model/Ingrediente';
import { Medida } from '../model/Medida';
import { Receita, Tipo } from '../model/Receita';
import { ReceitaIngrediente } from '../model/ReceitaIngrediente';
import { TipoUnidade } from '../model/TipoUnidade';
import { Usuario } from '../model/Usuario';
import util from '../util/util';
import ReceitaIngredienteController from './ReceitaIngredienteController';

class ReceitaController {
    // Métodos internos
    async import(dados: { nome: string, descricao: string, tipo: string, usuario?: string },
        dadosIngrediente: { nomeIngrediente: string, unidade?: string, quantidade?: number }[],
        dadosCategoria: { categoria: string }[]) {

        const nome = dados.nome.trim();
        const descricao = dados.descricao.trim();
        const tipo = <Tipo> dados.tipo.trim().toUpperCase();
        const usuario = dados.usuario?.trim().toLowerCase();

        const ingredienteController = new IngredienteController();
        const medidaController = new MedidaController();
        const unidadeController = new UnidadeController();
        const usuarioController = new UsuarioController();

        const usuarioReceita = await usuarioController.findByLoginOrEmail(usuario);
        const receita = new Receita(nome, descricao, tipo, usuarioReceita);

        receita.save();

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
                receitaIngrediente.unidade = await unidadeController.findUnidade();
            }

            if (quantidade) receitaIngrediente.quantidade  = quantidade;

            await receitaIngrediente.save();
        }
    }

    async typeIndex(request: Request, response: Response) {

        const tipos= Object.keys(Tipo);

        return response.status(200).json(tipos);
    }

    async findMatches(request: Request, response: Response) {
        const repository = getCustomRepository(ReceitaRepository);

        const { ids, derivadoLeite, gluten } = request.query as { ids: string[], derivadoLeite: string, gluten: string };

        const rIController = new ReceitaIngredienteController();

        const glutenBoolean: boolean = util.getBoolean2(gluten && <string> gluten);
        const derivadoLeiteBoolean: boolean = util.getBoolean2(derivadoLeite && <string> derivadoLeite);

        const ids2: number[] = ids.map((id: string) => {
            return parseInt(id);
        });

        if (!ids2) throw 'Nenhum ingrediente encontrado.';

        try {
            const matches = rIController.findMatches({ glutenBoolean, derivadoLeiteBoolean, ids2 });

            return util.systrace(200, response, matches);

        } catch (e) {
            util.syserror(400, response, e);
        }
    }

    async findByNameAndUser(nome: string, usuario: Usuario): Promise<Receita> {
        const repository = getCustomRepository(ReceitaRepository);

        const receita: any = await repository.findByNameAndUser(nome.trim().toLowerCase(), usuario);

        return receita;
    }
}

export default ReceitaController;