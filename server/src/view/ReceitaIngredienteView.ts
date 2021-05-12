import { Midia } from "../model/Midia";
import { Receita } from "../model/Receita";
import { ReceitaIngrediente } from "../model/ReceitaIngrediente";

import ingredienteUnidadeView from "./IngredienteUnidadeView";

export default {
  render(rI: ReceitaIngrediente) {
    if (rI) {
      return {
        id: rI.ingrediente.id,
        nome: rI.ingrediente.nome,
        //medida: ingredienteUnidadeView.render(rI.unidade, rI.ingrediente, rI.quantidade),
        qtde: rI.quantidade
      };
    }

    return null;
  },

  renderMany(rI: ReceitaIngrediente[]) {
    return rI.map(ingrediente => { return this.render(ingrediente); });
  }
};