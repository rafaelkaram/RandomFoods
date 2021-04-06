import SERVER_URL from '../config/constants';
import { Midia } from '../entity/Midia';
import Util from '../util/Util';

export default {
  render(midia: Midia) {
    return {
      id: midia.id,
      url: `http://${ Util.getLocalIP() }:${ process.env.PORT }/uploads/midia/receita/${ midia.path }`
    };
  },

  renderMany(midias: Midia[]) {
    return midias.map(midia => this.render(midia));
  }
};