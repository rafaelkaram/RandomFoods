import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';

import Util from '../util/Util';

import CategoriaService from './CategoriaService';
import IngredienteService from './IngredienteService';
import ReceitaService from './ReceitaService';
import ReceitaIngredienteService from './ReceitaIngredienteService';
import UnidadeService from './UnidadeService';

import { Ingrediente } from '../entity/Ingrediente';
import { Receita, Tipo } from '../entity/Receita';
import { ReceitaIngrediente } from '../entity/ReceitaIngrediente';
import { TipoUnidade } from '../entity/TipoUnidade';
import { Unidade } from '../entity/Unidade';

class FileImportService {
    // Métodos das rotas
    async create(request: Request, response: Response) {
        const arquivos = request.files as Express.Multer.File[];

        const erros: { arquivo: string; error: any; }[] = [];
        const errosInsercao: { receita: string; error: any; }[] = [];
        let invalidos: number = 0;
        let qtdeReceitas: number = 0;

        arquivos.map(async arquivo => {
            const nomeArquivo = arquivo.filename;
            const isExtensao = Util.isExtensao(nomeArquivo, [ 'xlsx', 'xls', 'csv' ]);

            if (!isExtensao) {
                invalidos++;
                console.log(`Removendo arquivo ${ nomeArquivo }.\nTipo de arquivo inválido`);
                fs.unlink(path.join(Util.getPath('import'), nomeArquivo), (err) => {
                    if (err) throw err;
                });
            } else {
                try {

                    const workbook = XLSX.readFile(path.join(Util.getPath('import'), nomeArquivo));

                    const sheetReceita = XLSX.utils.sheet_to_json(workbook.Sheets['Receita']);
                    const sheetIngrediente = XLSX.utils.sheet_to_json(workbook.Sheets['Ingrediente']);
                    const sheetCategoria = XLSX.utils.sheet_to_json(workbook.Sheets['Categoria']);

                    const receitaService = new ReceitaService();
                    const categoriaService = new CategoriaService();
                    const ingredienteService = new IngredienteService();
                    const receitaIngredienteService = new ReceitaIngredienteService();
                    const unidadeService = new UnidadeService();

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
                                const receita = await receitaService.insert(Nome, Descricao, Tipo, Usuario) as Receita;

                                const catObj = sheetCategoria.filter((item) => item.Receita === Nome);
                                const ingredientes = sheetIngrediente.filter((item) => item.Receita === Nome);

                                const categorias = catObj.map(categoria => {
                                    return categoria.Categoria;
                                });

                                if (categorias && categorias.length > 0) {
                                    categoriaService.insertByRecipe(categorias, receita);
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

                                    const ingrediente: Ingrediente = await ingredienteService.findByName(Ingrediente);

                                    let unidade: Unidade | null = null;
                                    let quantidade: number | null = null;

                                    if (!Quantidade && !ingrediente.semMedida) {
                                          throw Error(`Ingrediente ${ ingrediente.nome } não aceita quantidades nulas`);
                                    } else if (ingrediente.tipoUnidade === TipoUnidade[TipoUnidade.UNIDADE]) {
                                        const unidades = await unidadeService.findSI(TipoUnidade[TipoUnidade.UNIDADE]);
                                        unidade = unidades[0];
                                    } else if (Unidade) {
                                        unidade = await unidadeService.find(Unidade, ingrediente);
                                    }

                                    const receitaIngrediente = new ReceitaIngrediente();
                                    receitaIngrediente.ingrediente = ingrediente;
                                    receitaIngrediente.receita = receita;
                                    if (unidade)
                                        receitaIngrediente.unidade     = unidade;
                                    if (Quantidade)
                                        receitaIngrediente.quantidade  = Quantidade;

                                    await receitaIngredienteService.insertByRecipe(receitaIngrediente);
                                });
                            } catch (err) {
                                //console.error(err);
                                console.log('oi mãe');

                                errosInsercao.push({ receita: Nome, error: err });
                            }
                        }
                    });
                } catch (err) {
                    //console.error(err);
                    console.log('oi mãe');
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

        return response.status(201).json({
            message: `${ arquivos.length - invalidos } arquivos importados com sucesso. ${ invalidos } possuiam formato inválido e não foram importados.`
        });
    }
}

export default FileImportService;