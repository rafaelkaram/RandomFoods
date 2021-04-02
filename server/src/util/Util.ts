import path from 'path';

export default {
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
  }

}