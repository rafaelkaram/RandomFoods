import { Ingrediente, TipoIngrediente } from "../entity/Ingrediente";
import util from '../util/util';

export default {
  render(tipo: TipoIngrediente) {
    return {
      url: `http://${ util.getLocalIP() }:${ process.env.PORT }/uploads/ingredient-types/${ tipo.toLowerCase() }-colored.png`,
      alt_url: `http://${ util.getLocalIP() }:${ process.env.PORT }/uploads/ingredient-types/${ tipo.toLowerCase() }.png`,
    };
  },

  renderMany(ingredientes: Ingrediente[]) {
    if (ingredientes && ingredientes.length > 0) {
      const tipoStr = ingredientes[0].tipoIngrediente;
      const tipo = TipoIngrediente[tipoStr];

      return {
        nome: tipo,
        url: `http://${ util.getLocalIP() }:${ process.env.PORT }/uploads/ingredient-types/${ tipoStr.toLowerCase() }-colored.png`,
        alt_url: `http://${ util.getLocalIP() }:${ process.env.PORT }/uploads/ingredient-types/${ tipoStr.toLowerCase() }.png`,
        ingredientes: ingredientes
      };
    }

    return null;
  }
};