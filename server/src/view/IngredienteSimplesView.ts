import { Ingrediente } from "../model/Ingrediente";

export default {
  render(ingrediente: Ingrediente) {
    return {
      id: ingrediente.id,
      nome: ingrediente.nome
    }
  },

  renderMany(ingredienteList: Ingrediente[]) {
    return ingredienteList.map(ingrediente => this.render(ingrediente));
  }
};