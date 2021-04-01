import { ReceitaIngrediente } from "../entity/ReceitaIngrediente";

import ingredienteUnidadeView from "./IngredienteUnidadeView";

export default {
  render(rI: ReceitaIngrediente) {
    if (rI) {
      return {
        id: rI.ingrediente.id,
        nome: rI.ingrediente.nome,
        qtde: ingredienteUnidadeView.render(rI.unidade, rI.ingrediente, rI.quantidade)
      };
    }

    return null;
  },

  renderMany(ingredienteList: ReceitaIngrediente[]) {
    return ingredienteList.map(ingrediente => this.render(ingrediente));
  }
};