import { Ingrediente, TipoIngrediente } from "../entity/Ingrediente";
import Util from '../util/Util';

export default {
  render(tipo: TipoIngrediente) {
    return {
      url: `http://${ Util.getLocalIP() }:${ process.env.PORT }/uploads/ingredient-types/${ tipo.toLowerCase() }-colored.png`,
      alt_url: `http://${ Util.getLocalIP() }:${ process.env.PORT }/uploads/ingredient-types/${ tipo.toLowerCase() }.png`,
    };
  },

  renderMany(ingredientes: Ingrediente[]) {
    if (ingredientes && ingredientes.length > 0) {
      const tipoStr = ingredientes[0].tipoIngrediente;
      const tipo = TipoIngrediente[tipoStr];

      return {
        tipo,
        url: `http://${ Util.getLocalIP() }:${ process.env.PORT }/uploads/ingredient-types/${ tipoStr.toLowerCase() }-colored.png`,
        alt_url: `http://${ Util.getLocalIP() }:${ process.env.PORT }/uploads/ingredient-types/${ tipoStr.toLowerCase() }.png`,
        ingredientes: ingredientes
      };
    }

    return null;
  }
};