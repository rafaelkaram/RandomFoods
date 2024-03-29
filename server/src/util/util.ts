import { Response } from 'express';
import crypto from 'crypto';
import path from 'path';
import os from 'os';
import fs from 'fs';

import {
	FACTOR,
	SHEET_AVALIACAO,
	SHEET_CATEGORIA,
	SHEET_INGREDIENTE,
	SHEET_MEDIDA,
	SHEET_UNIDADE,
	SHEET_USUARIO
} from './constants';

import UsuarioController from '../controller/UsuarioController';
import UnidadeController from '../controller/UnidadeController';
import MedidaController from '../controller/MedidaController';
import IngredienteController from '../controller/IngredienteController';
import AvaliacaoController from '../controller/AvaliacaoController';
import CategoriaController from '../controller/CategoriaController';

import { Tipo } from '../model/Midia';

export const getLocalIP = () => {
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
}

export const isExtensao = (nomeArquivo: string, extensoes: string[]): boolean => {
	const extensao = nomeArquivo.split('.').pop();

	if (!extensao)
		return false;

	for (let key in extensoes) {
		const ext = extensoes[key];

		if (ext === extensao)
			return true;
	}

	return false;
}

export const getPath = (tipo: string, buffer?: string): string => {
	if (tipo === 'midia' && buffer)
		return path.join(__dirname, '..', '..', 'uploads', 'midia', 'receita', buffer);

	if (tipo === 'usuario')
		return path.join(__dirname, '..', '..', 'uploads', 'midia', 'usuario');

	if (tipo === 'temp')
		return path.join(__dirname, '..', '..', 'uploads', 'temp');

	return path.join(__dirname, '..', '..', 'uploads', 'imports');
}

export const getHash = (senha: string): string => {
	const hash = crypto.createHmac('sha256', senha)
		.update(FACTOR)
		.digest('hex');

	return hash;
}

export const getBoolean = (value?: string | boolean): boolean | null => {
	if (typeof value === 'boolean') return value;

	if (value) {
		const text = value.toLowerCase();
		if (text === 'true' || text === 'sim' || text === '1') return true;
		if (text === 'false' || text === 'nao' || text === 'não' || text === '0') return false;
	}

	return null;
}

export const getBoolean2 = (value?: string | boolean): boolean => {
	const bool: boolean | null = getBoolean(value);

	return bool ? true : false;
}

export const getFraction = (value: number): string => {
	const floor: number = Math.floor(value);
	if (value == floor) return value.toString();

	const fraction: number = value - floor;
	const partition: number = Math.floor(1 / fraction);

	if(floor === 0) return `1/${ partition }`;
	return `${ floor } e 1/${ partition }`;
}

export const getImportData = (nome: string): { sheetName: string, controller: any } => {
	if (nome === 'avaliacao' || nome === 'avaliacões') {

		const sheetName = SHEET_AVALIACAO;
		const controller = new AvaliacaoController();

		return { sheetName, controller };

	} else if (nome === 'categoria' || nome === 'categorias') {

		const sheetName = SHEET_CATEGORIA;
		const controller = new CategoriaController();

		return { sheetName, controller };

	} else if (nome === 'ingrediente' || nome === 'ingredientes') {

		const sheetName = SHEET_INGREDIENTE;
		const controller = new IngredienteController();

		return { sheetName, controller };

	} else if (nome === 'medida' || nome === 'medidas') {

		const sheetName = SHEET_MEDIDA;
		const controller = new MedidaController();

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
}

export const getMessage = (msg: string, params?: string[]): string => {
	if (params && params.length > 0) {
		let text = msg;
		for (let i = 0; i < params.length; i++) {
			text = text.replace(`{${ i.toString() }}`, params[i]);
		}
		return text;
	}

	return msg;
}

export const encryptMidia = (valor?: string): string => {
	return Buffer.from(valor ? valor : 'error').toString('hex');
}

export const moveFile = (buffer: string, nome: string, novoNome?: string, tipo?: Tipo): void => {
	const srcPath: string = path.join(getPath('temp'), nome);
	let destPath: string = '';

	if (tipo && novoNome) destPath = path.join(getPath('midia', buffer), `${ novoNome }.${ tipo === Tipo.FOTO ? 'png' : 'mp4' }`);
	else destPath = path.join(getPath('usuario'), `${ buffer }.png`);

	if (!fs.existsSync(srcPath)) throw Error('Source file doens\'t exists.');

	fs.copyFileSync(srcPath, destPath);
	fs.unlinkSync(srcPath);
}

export const systrace = (status: number, response: Response, value?: any): Response => {
	if (!value) {
		if (status === 204) return response.status(status).send();

		throw Error('Status requires response.');
	}
	console.log(value);

	if (status === 200) return response.status(status).json(value);
	return response.status(status).json({ message: value });
}

export const syserror = (status: number, response: Response, value?: any): Response => {
	if (!value) {
		if (status === 401 || status === 403 || status === 404 ||status === 405) return response.status(status).send();
		throw Error('Status requires response.');
	}
	console.error(value);

	return response.status(status).json({ error: value });
}