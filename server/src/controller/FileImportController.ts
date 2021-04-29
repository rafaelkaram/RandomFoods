import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';

import util from '../util/util';

class FileImportController {
    // Métodos das rotas
    async create(request: Request, response: Response) {
        const arquivos = request.files as Express.Multer.File[];
        const { nome } = request.params;

        const { sheetName, controller } = util.getImportData(nome);
        const erros: { arquivo: string; error: any; }[] = [];
        const errosInsercao: { error: any; }[] = [];
        let invalidos: number = 0;
        let qtde: number = 0;

        for (let i in arquivos) {
        const arquivo = arquivos[i];
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

                    const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

                    for (let j in sheet) {
                        const dados = sheet[j];

                        try {

                            await controller.import(dados);
                            qtde++;

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
        }

        return util.systrace(201, response, {
            importacao: `${ arquivos.length - invalidos } arquivos importados com sucesso. ${ invalidos } possuiam formato inválido e não foram importados.`,
            sucesso: `${ qtde } ${ nome } cadastrados com sucesso.`,
            erro: errosInsercao
        });
    }

    /*async createRecipe(request: Request, response: Response) {
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
                                        NomeIngrediente: string,
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
    }*/
}

export default FileImportController;