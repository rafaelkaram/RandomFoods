import { response, Response } from 'express';
import path from 'path';
import os from 'os';

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

  encryptMidia(valor?: string): string {
    return Buffer.from(valor ? valor : 'error').toString('hex');
  },

  systrace (status: number, response: Response, value?: any): Response {
    if (!value) {
      if (status === 204) {
        return response.status(status).send();
      }

      throw Error('Status requer atributo de retorno.');
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

      throw Error('Status requer atributo de retorno.');
    }

    console.log(value);

    return response.status(status).json({ error: value });
  }

}