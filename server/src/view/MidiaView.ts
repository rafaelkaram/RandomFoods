import util from '../util/util';

import { Midia } from '../model/Midia';

export default {
  render(midia: Midia) {
    return {
      id: midia.id,
      path: `http://${ util.getLocalIP() }:${ process.env.PORT }/uploads/midia/receita/${ midia.path }`,
      tipo: midia.tipo,
      dataCadastro: midia.dataCadastro
    };
  },

  renderMany(midias: Midia[]) {
    return midias.map(midia => this.render(midia));
  }
};