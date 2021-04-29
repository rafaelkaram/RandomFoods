import { Response } from 'express';
import crypto from 'crypto';
import path from 'path';
import os from 'os';

import {
  FACTOR,
  SHEET_AVALIACAO,
  SHEET_CATEGORIA,
  SHEET_COMENTARIO,
  SHEET_FAVORITO,
  SHEET_INGREDIENTE,
  SHEET_MARCA,
  SHEET_MEDIDA,
  SHEET_MIDIA,
  SHEET_RECEITA,
  SHEET_SEGUIDOR,
  SHEET_UNIDADE,
  SHEET_USUARIO
} from './constants';
import UsuarioController from '../controller/UsuarioController';
import UnidadeController from '../controller/UnidadeController';
import MedidaController from '../controller/MedidaController';
import IngredienteController from '../controller/IngredienteController';
import AvaliacaoController from '../controller/AvaliacaoController';
import CategoriaController from '../controller/CategoriaController';

export default {
  getLocalIP() {
    const networkInterfaces = os.networkInterfaces;

    const nets = networkInterfaces();

    for (const name of Object.keys(nets)) {
      for (const net of nets[name]) {
        if (net.family === 'IPv4' && !net.internal) {
          return net.address;
        }
      }
    }

    return '127.0.0.1';
  },

  isExtensao(nomeArquivo: string, extensoes: string[]): boolean {
    const extensao = nomeArquivo.split('.').pop();

    if (!extensao)
      return false;

    for (let key in extensoes) {
      const ext = extensoes[key];

      if (ext === extensao)
        return true;
    }

    return false;
  },

  getFolderName(nomeArquivo: string): string {
    const nome = nomeArquivo.split('.').shift();

    if (!nome)
      throw Error('Arquivo não possui nome');

    const userCode = nome.split('-').pop() as string;

    return userCode;
  },

  getPath(tipo: string, nomeArquivo?: string): string {
    if (tipo === 'midia' && nomeArquivo) {
      const folderName = this.getFolderName(nomeArquivo);
      return path.join(__dirname, '..', '..', 'uploads', 'midia', 'receita', folderName);
    }

    if (tipo === 'usuario') {
      return path.join(__dirname, '..', '..', 'uploads', 'midia', 'usuario');
    }

    return path.join(__dirname, '..', '..', 'uploads', 'imports');
  },

  getHash(senha: string): string {
    const hash = crypto.createHmac('sha256', senha)
      .update(FACTOR)
      .digest('hex');

    return hash;
  },

  getBoolean(value?: string | boolean): boolean | null {
    if (typeof value === 'boolean') {
      return value;
    }

    if (value) {
      const text = value.toLowerCase();
      if (text === 'true' || text === 'sim') return true;
      if (text === 'false' || text === 'nao' || text === 'não') return false;
    }

    return null;
  },

  getImportData(nome: string): { sheetName: string, controller: any } {
    if (nome === 'avaliacao' || nome === 'avaliacões') {

      const sheetName = SHEET_AVALIACAO;
      const controller = new AvaliacaoController();

      return { sheetName, controller };

    } else if (nome === 'categoria' || nome === 'categorias') {

      const sheetName = SHEET_CATEGORIA;
      const controller = new CategoriaController();

      return { sheetName, controller };

    } else if (nome === 'comentario' || nome === 'comentarios') {

      const sheetName = SHEET_COMENTARIO;
      const controller = new ComentarioController();

      return { sheetName, controller };

    } else if (nome === 'favorito' || nome === 'favoritos') {

      const sheetName = SHEET_FAVORITO;
      const controller = new FavoritoController();

      return { sheetName, controller };

    } else if (nome === 'ingrediente' || nome === 'ingredientes') {

      const sheetName = SHEET_INGREDIENTE;
      const controller = new IngredienteController();

      return { sheetName, controller };

    } else if (nome === 'marca' || nome === 'marcas') {

      const sheetName = SHEET_MARCA;
      const controller = new MarcaController();

      return { sheetName, controller };

    } else if (nome === 'medida' || nome === 'medidas') {

      const sheetName = SHEET_MEDIDA;
      const controller = new MedidaController();

      return { sheetName, controller };

    } else if (nome === 'midia' || nome === 'midias') {

      const sheetName = SHEET_MIDIA;
      const controller = new MidiaController();

      return { sheetName, controller };

    } else if (nome === 'receita' || nome === 'receitas') {

      const sheetName = SHEET_RECEITA;
      const controller = new ReceitaController();

      return { sheetName, controller };

    } else if (nome === 'seguidor' || nome === 'seguidors') {

      const sheetName = SHEET_SEGUIDOR;
      const controller = new SeguidorController();

      return { sheetName, controller };

    } else if (nome === 'unidade' || nome === 'unidades') {

      const sheetName = SHEET_UNIDADE;
      const controller = new UnidadeController();

      return { sheetName, controller };

    } else if (nome === 'usuario' || nome === 'usuarios') {

      const sheetName = SHEET_USUARIO;
      const controller = new UsuarioController();

      return { sheetName, controller };

    } throw Error('Tipo de importação não encontrada.');
  },

  getcontroller(msg: string, params?: string[]): string {
    if (params && params.length > 0) {
      let text = msg;
      for (let i = 0; i < params.length; i++) {
        text = text.replace(`{${ i.toString() }}`, params[i]);
      }
      return text;
    }

    return msg;
  },

  getMessage(msg: string, params?: string[]): string {
    if (params && params.length > 0) {
      let text = msg;
      for (let i = 0; i < params.length; i++) {
        text = text.replace(`{${ i.toString() }}`, params[i]);
      }
      return text;
    }

    return msg;
  },

  encryptMidia(valor?: string): string {
    return Buffer.from(valor ? valor : 'error').toString('hex');
  },

  systrace (status: number, response: Response, value?: any): Response {
    if (!value) {
      if (status === 204) {
        return response.status(status).send();
      }

      throw Error('Status requires response.');
    }

    console.log(value);

    if (status === 200) {
      return response.status(status).json(value);
    }

    return response.status(status).json({ message: value });
  },

  syserror (status: number, response: Response, value?: any): Response {
    if (!value) {
      if (status === 401 || status === 403 || status === 405) {
        return response.status(status).send();
      }

      throw Error('Status requires response.');
    }

    console.error(value);

    return response.status(status).json({ error: value });
  },

}
