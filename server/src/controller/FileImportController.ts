import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';

import {
    encryptMidia,
    getImportData,
    getPath,
    isExtensao,
    systrace
} from '../util/util';

import ReceitaController from './ReceitaController';

class FileImportController {
    // Métodos das rotas
    async create(request: Request, response: Response) {
        const arquivos = request.files as Express.Multer.File[];
        const { nome } = request.params;

        const { sheetName, controller } = getImportData(nome);
        const erros: { arquivo: string; error: any; }[] = [];
        const errosInsercao: { error: any; }[] = [];
        let invalidos: number = 0;
        let qtde: number = 0;

        for (let i in arquivos) {
        const arquivo = arquivos[i];
            const nomeArquivo = arquivo.filename;
            const validFile = isExtensao(nomeArquivo, [ 'xlsx', 'xls', 'csv' ]);

            if (!validFile) {
                invalidos++;
                console.log(`Removendo arquivo ${ nomeArquivo }.\nTipo de arquivo inválido`);
                fs.unlink(path.join(getPath('import'), nomeArquivo), (err) => {
                    if (err) throw err;
                });
            } else {
                try {

                    const workbook = XLSX.readFile(path.join(getPath('import'), nomeArquivo));

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

        return systrace(201, response, {
            importacao: `${ arquivos.length - invalidos } arquivos importados com sucesso. ${ invalidos } possuiam formato inválido e não foram importados.`,
            sucesso: `${ qtde } ${ nome } cadastrados com sucesso.`,
            erro: errosInsercao
        });
    }

    async createRecipe(request: Request, response: Response) {
        const arquivos = request.files as Express.Multer.File[];

        const erros: { arquivo: string; error: any; }[] = [];
        const errosInsercao: { receita: string; error: any; }[] = [];
        let invalidos: number = 0;
        let qtde: number = 0;

        for (let i in arquivos) {
            const arquivo = arquivos[i];
            const nomeArquivo = arquivo.filename;
            const validFile = isExtensao(nomeArquivo, [ 'xlsx', 'xls', 'csv' ]);

            if (!validFile) {
                invalidos++;
                console.log(`Removendo arquivo ${ nomeArquivo }.\nTipo de arquivo inválido`);
                fs.unlink(path.join(getPath('import'), nomeArquivo), (err) => {
                    if (err) throw err;
                });
            } else {
                try {

                    const workbook: XLSX.WorkBook = XLSX.readFile(path.join(getPath('import'), nomeArquivo));

                    const sheetReceita = XLSX.utils.sheet_to_json(workbook.Sheets['Receita']);
                    const sheetIngrediente = XLSX.utils.sheet_to_json(workbook.Sheets['Ingrediente']);
                    const sheetCategoria = XLSX.utils.sheet_to_json(workbook.Sheets['Categoria']);

                    const dadosReceita: any = sheetReceita.map(dados => {
                        return dados as { nome: string, descricao: string, tempoPreparo: number, porcoes: number, tipo: string, usuario?: string };
                    });
                    const dadosIngrediente: any = sheetIngrediente.map(dados => {
                        return dados as { receita: string, nomeIngrediente: string, unidade?: string, quantidade?: number };
                    });
                    const dadosCategoria: any = sheetCategoria.map(dados => {
                        return dados as { categoria: string, receita: string };
                    });

                    const receitaController = new ReceitaController();

                    for (let i in dadosReceita) {
                        const dadoReceita = dadosReceita[i];

                        try {
                            const nomeReceita = dadoReceita.nome.trim();
                            const ingredientesReceita = dadosIngrediente.filter((item: any) => item.receita.toLowerCase() === nomeReceita.toLowerCase());
                            const categoriasReceita = dadosCategoria.filter((item: any) => item.receita.toLowerCase() === nomeReceita.toLowerCase());

                            await receitaController.import(dadoReceita, ingredientesReceita, categoriasReceita);
                            qtde++;

                        } catch (err) {
                            console.error(err);
                            errosInsercao.push({ receita: dadoReceita.nome, error: err.message ? err.message : err });
                        }
                    }

                } catch (err) {
                        console.error(err);
                        erros.push({ arquivo: nomeArquivo, error: err });
                }
            }
        }

        return systrace(201, response, {
            importacao: `${ arquivos.length - invalidos } arquivos importados com sucesso. ${ invalidos } possuiam formato inválido e não foram importados.`,
            sucesso: `${ qtde } receitas cadastradas com sucesso.`,
            erro: errosInsercao
        });
    }

    async getFolderPath(request: Request, response: Response) {
        const { id } = request.params as { id: string };

        const buffer = encryptMidia(id);
        const midiaPath = path.join('uploads', 'midias', 'receita', buffer);

        systrace(201, response, buffer);
    }

    async getNewFolderPath(request: Request, response: Response) {
        const { idOld, idNew } = request.query as { idOld: string, idNew: string };

        const pastaAntiga = encryptMidia(idOld);
        const pastaNova = encryptMidia(idNew);

        systrace(201, response, { pastaAntiga, pastaNova });
    }
}

export default FileImportController;