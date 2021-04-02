import SERVER_URL from '../config/constants';
import { Midia } from '../entity/Midia';

export default {
  render(midia: Midia) {
    return {
      id: midia.id,
      url: `http://192.168.100.5:3333/uploads/receita/${ midia.path }`
    };
  },

  renderMany(midias: Midia[]) {
    return midias.map(midia => this.render(midia));
  }
};