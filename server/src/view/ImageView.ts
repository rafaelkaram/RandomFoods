import SERVER_URL from '../config/constants';

import { Ingrediente, TipoIngrediente } from "../entity/Ingrediente";

export default {
  render(ingredientes: Ingrediente[]) {
    if (ingredientes && ingredientes.length > 0) {
      const tipoStr = ingredientes[0].tipoIngrediente;
      const tipo = TipoIngrediente[tipoStr];

      return {
        tipo,
        url: `http://192.168.100.5:3333/uploads/ingredient-types/${ tipoStr.toLowerCase() }-colored.png`,
        alt_url: `http://192.168.100.5:3333/uploads/ingredient-types/${ tipoStr.toLowerCase() }.png`,
        ingredientes: ingredientes
      };
    }

    return null;
  }
};