import SERVER_URL from '../config/constants';

import { Ingrediente, TipoIngrediente } from "../entity/Ingrediente";

export default {
  render(ingredientes: Ingrediente[]) {
    if (ingredientes && ingredientes.length > 0) {
      const tipoStr = ingredientes[0].tipoIngrediente;
      const tipo = TipoIngrediente[tipoStr];

      return {
        tipo,
        url: `${ SERVER_URL }/uploads/ingredient-types/${ tipoStr.toLowerCase() }-colored.png`,
        alt_url: `${ SERVER_URL }/uploads/ingredient-types/${ tipoStr.toLowerCase() }.png`,
        ingredientes: ingredientes
      };
    }

    return null;
  }
};