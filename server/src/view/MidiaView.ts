import { Midia } from '../entity/Midia';
import util from '../util/util';

export default {
  render(midia: Midia) {
    return {
      id: midia.id,
      url: `http://${ util.getLocalIP() }:${ process.env.PORT }/uploads/midia/receita/${ midia.path }`
    };
  },

  renderMany(midias: Midia[]) {
    return midias.map(midia => this.render(midia));
  }
};