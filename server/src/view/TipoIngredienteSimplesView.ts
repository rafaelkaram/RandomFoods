import util from '../util/util';

import { Ingrediente, TipoIngrediente } from "../model/Ingrediente";

import IngredienteSimplesView from "./IngredienteSimplesView";

export default {
  render(tipo: TipoIngrediente) {
    return {
      url: `http://${ util.getLocalIP() }:${ process.env.PORT }/uploads/ingredient-types/${ tipo.toLowerCase() }-colored.png`,
    };
  },

  renderMany(ingredientes: Ingrediente[], tipo: TipoIngrediente) {
    if (ingredientes && ingredientes.length > 0) {
      return {
        nome: tipo,
        url: `http://${ util.getLocalIP() }:${ process.env.PORT }/uploads/ingredient-types/${ tipo.toLowerCase() }-colored.png`,
        ingredientes: IngredienteSimplesView.renderMany(ingredientes)
      };
    }

    return null;
  }
};