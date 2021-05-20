import util from '../util/util';

import { Midia, Tipo } from '../model/Midia';

export default {
  render(midia: Midia, id: number) {
    const extensao = midia.tipo === Tipo.FOTO ? '.png' : '.mp4';
    const filePath = midia.path + extensao;
    const folderName = util.encryptMidia(id.toString());

    return {
      id: midia.id,
      path: `http://${ util.getLocalIP() }:${ process.env.PORT }/uploads/midia/receita/${ folderName }/${ filePath }`,
      tipo: midia.tipo,
      dataCadastro: midia.dataCadastro
    };
  },

  renderMany(midias: Midia[], id: number) {
    return midias.map(midia => this.render(midia, id));
  }
};