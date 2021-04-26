import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';

import util from '../util/util';

import CategoriaController from './CategoriaController';
import IngredienteController from './IngredienteController';
import ReceitaController from './ReceitaController';
import ReceitaIngredienteController from './ReceitaIngredienteController';
import UnidadeController from './UnidadeController';

import { Ingrediente } from '../model/Ingrediente';
import { Receita, Tipo } from '../model/Receita';
import { ReceitaIngrediente } from '../model/ReceitaIngrediente';
import { TipoUnidade } from '../model/TipoUnidade';
import { Unidade } from '../model/Unidade';
import { Perfil as perfil, Usuario } from '../model/Usuario';

class FileImportController {
    // Métodos das rotas
    async createUser(request: Request, response: Response) {
        const arquivos = request.files as Express.Multer.File[];

        const erros: { arquivo: string; error: any; }[] = [];
        const errosInsercao: { error: any; }[] = [];
        let invalidos: number = 0;
        let qtdeUsuarios: number = 0;

        arquivos.map(async arquivo => {
            const nomeArquivo = arquivo.filename;
            const isExtensao = util.isExtensao(nomeArquivo, [ 'xlsx', 'xls', 'csv' ]);

            if (!isExtensao) {
                invalidos++;
                console.log(`Removendo arquivo ${ nomeArquivo }.\nTipo de arquivo inválido`);
                fs.unlink(path.join(util.getPath('import'), nomeArquivo), (err) => {
                    if (err) throw err;
                });
            } else {
                try {

                    const workbook = XLSX.readFile(path.join(util.getPath('import'), nomeArquivo));

                    const sheetUsuario = XLSX.utils.sheet_to_json(workbook.Sheets['Usuário']);

                    for (let key in sheetUsuario) {
                        const dados = sheetUsuario[key];

                        try {
                            const {
                                Login,
                                Nome,
                                Email,
                                Senha,
                                Ativo,
                                TrocaLogin,
                                Perfil,
                                NotificarSeguidor,
                                NotificarAvaliacao,
                                NotificarComentario,
                                NotificarFavorito,
                                NotificarResposta,
                                NotificarMarca,
                            } = dados as {
                                Login: string,
                                Nome: string,
                                Email: string,
                                Senha: string,
                                Ativo?: string,
                                TrocaLogin?: string,
                                Perfil?: perfil,
                                NotificarSeguidor?: string,
                                NotificarAvaliacao?: string,
                                NotificarComentario?: string,
                                NotificarFavorito?: string,
                                NotificarResposta?: string,
                                NotificarMarca?: string,
                                };

                                const hash = util.getHash(Senha);
                                const ativo = util.getBoolean(Ativo);
                                const trocaLogin = util.getBoolean(TrocaLogin);
                                const seguidor = util.getBoolean(NotificarSeguidor);
                                const avaliacao = util.getBoolean(NotificarAvaliacao);
                                const comentario = util.getBoolean(NotificarComentario);
                                const favorito = util.getBoolean(NotificarFavorito);
                                const resposta = util.getBoolean(NotificarResposta);
                                const marca = util.getBoolean(NotificarMarca);

                                const usuario = new Usuario();
                                usuario.login = Login;
                                usuario.nome = Nome;
                                usuario.email = Email;
                                usuario.senha = hash;

                                if (ativo) usuario.ativo = ativo;
                                if (trocaLogin) usuario.trocaLogin = trocaLogin;
                                if (Perfil) usuario.perfil = Perfil;
                                if (seguidor) usuario.notificarSeguidor = seguidor;
                                if (avaliacao) usuario.notificarAvaliacao = avaliacao;
                                if (comentario) usuario.notificarComentario = comentario;
                                if (favorito) usuario.notificarFavorito = favorito;
                                if (resposta) usuario.notificarResposta = resposta;
                                if (marca) usuario.notificarMarca = marca;

                                await usuario.save();

                                qtdeUsuarios++;
                            } catch (err) {
                                console.error(err);
                                errosInsercao.push({ error: err })
                            }

                        }

                } catch (err) {
                    console.error(err);
                    erros.push({ arquivo: nomeArquivo, error: err });
                }
            }
        });

        return util.systrace(201, response, {
            message: `${ arquivos.length - invalidos } arquivos importados com sucesso. ${ invalidos } possuiam formato inválido e não foram importados.`,
            sucesso: `${ qtdeUsuarios } usuários importados com sucesso.`,
            erro: errosInsercao
        });
    }

    async createRecipe(request: Request, response: Response) {
        const arquivos = request.files as Express.Multer.File[];

        const erros: { arquivo: string; error: any; }[] = [];
        const errosInsercao: { receita: string; error: any; }[] = [];
        let invalidos: number = 0;
        let qtdeReceitas: number = 0;

        arquivos.map(async arquivo => {
            const nomeArquivo = arquivo.filename;
            const isExtensao = util.isExtensao(nomeArquivo, [ 'xlsx', 'xls', 'csv' ]);

            if (!isExtensao) {
                invalidos++;
                console.log(`Removendo arquivo ${ nomeArquivo }.\nTipo de arquivo inválido`);
                fs.unlink(path.join(util.getPath('import'), nomeArquivo), (err) => {
                    if (err) throw err;
                });
            } else {
                try {

                    const workbook = XLSX.readFile(path.join(util.getPath('import'), nomeArquivo));

                    const sheetReceita = XLSX.utils.sheet_to_json(workbook.Sheets['Receita']);
                    const sheetIngrediente = XLSX.utils.sheet_to_json(workbook.Sheets['Ingrediente']);
                    const sheetCategoria = XLSX.utils.sheet_to_json(workbook.Sheets['Categoria']);

                    const receitaController = new ReceitaController();
                    const categoriaController = new CategoriaController();
                    const ingredienteController = new IngredienteController();
                    const receitaIngredienteController = new ReceitaIngredienteController();
                    const unidadeController = new UnidadeController();

                    qtdeReceitas = sheetReceita.length;

                    sheetReceita.map(async dadosReceita => {
                        if (dadosReceita) {
                            const {
                                Nome,
                                Descricao,
                                Tipo,
                                Usuario } = dadosReceita as {
                                    Nome: string,
                                    Descricao: string,
                                    Tipo: Tipo,
                                    Usuario?: string
                                };

                            try {
                                const receita = await receitaController.insert(Nome, Descricao, Tipo, Usuario) as Receita;

                                const catObj = sheetCategoria.filter((item) => item.Receita === Nome);
                                const ingredientes = sheetIngrediente.filter((item) => item.Receita === Nome);

                                const categorias = catObj.map(categoria => {
                                    return categoria.Categoria;
                                });

                                if (categorias && categorias.length > 0) {
                                    categoriaController.insertByRecipe(categorias, receita);
                                }

                                ingredientes.map(async dadosIngrediente => {
                                    const {
                                        Ingrediente,
                                        Unidade,
                                        Quantidade
                                    } = dadosIngrediente as {
                                        Ingrediente: string,
                                        Unidade?: string,
                                        Quantidade?: number
                                    };

                                    const ingrediente: Ingrediente = await ingredienteController.findByName(Ingrediente);

                                    let unidade: Unidade | null = null;

                                    if (!Quantidade && !ingrediente.semMedida) {
                                          throw Error(`Ingrediente ${ ingrediente.nome } não aceita quantidades nulas`);
                                    } else if (ingrediente.tipoUnidade === TipoUnidade[TipoUnidade.UNIDADE]) {
                                        const unidades = await unidadeController.findSI(TipoUnidade[TipoUnidade.UNIDADE]);
                                        unidade = unidades[0];
                                    } else if (Unidade) {
                                        unidade = await unidadeController.find(Unidade, ingrediente);
                                    }

                                    const receitaIngrediente = new ReceitaIngrediente();
                                    receitaIngrediente.ingrediente = ingrediente;
                                    receitaIngrediente.receita = receita;
                                    if (unidade)
                                        receitaIngrediente.unidade     = unidade;
                                    if (Quantidade)
                                        receitaIngrediente.quantidade  = Quantidade;

                                    await receitaIngredienteController.insertByRecipe(receitaIngrediente);
                                });
                            } catch (err) {
                                console.error(err);

                                errosInsercao.push({ receita: Nome, error: err });
                            }
                        }
                    });
                } catch (err) {
                    console.error(err);
                    erros.push({ arquivo: nomeArquivo, error: err });
                }
            }
        });

        const falhas = await erros.length;
        const falhasInsercao = await errosInsercao.length;
        console.log({falhas, falhasInsercao});


        if (falhas && falhasInsercao) {
            const sucessos = arquivos.length - falhas - invalidos;
            const inseridos = qtdeReceitas - falhasInsercao;
            return response.status(418).json({
                message: `${ sucessos } importados com sucesso. ${ falhas } retornaram erro. ${ invalidos } possuiam formato inválido e não foram importados.`,
                insert: `${ inseridos } novas receitas cadastradas`,
                falhas: errosInsercao,
                error: erros
            });
        } else if (falhasInsercao) {
            const inseridos = qtdeReceitas - falhasInsercao;
            return response.status(418).json({
                message: `${ arquivos.length - invalidos } arquivos importados com sucesso. ${ invalidos } possuiam formato inválido e não foram importados.`,
                insert: `${ inseridos } novas receitas cadastradas`,
                falhas: errosInsercao
            });
        } else if (falhas) {
            const sucessos = arquivos.length - falhas - invalidos;
            return response.status(418).json({
                message: `${ sucessos } importados com sucesso. ${ falhas } retornaram erro. ${ invalidos } possuiam formato inválido e não foram importados.`,
                error: erros
            });
        }

        return util.systrace(201, response, {
            message: `${ arquivos.length - invalidos } arquivos importados com sucesso. ${ invalidos } possuiam formato inválido e não foram importados.`
        });
    }
}

export default FileImportController;