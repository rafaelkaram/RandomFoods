import SERVER_URL from '../config/constants';
import { Midia } from '../entity/Midia';

export default {
  render(midia: Midia) {
    return {
      id: midia.id,
      url: `${ SERVER_URL }/uploads/${ midia.path }`
    };
  },

  renderMany(midias: Midia[]) {
    return midias.map(midia => this.render(midia));
  }
};