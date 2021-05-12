import { Ingrediente } from "../model/Ingrediente";

export default {
  renderSimple(ingrediente: Ingrediente) {
    if (ingrediente) {
      return {
        id: ingrediente.id,
        nome: ingrediente.nome,
        gluten: ingrediente.gluten,
        derivadoLeite: ingrediente.derivadoLeite
      }
    }

    return null;
  },

  render(ingrediente: Ingrediente) {
    if (ingrediente) {
      return {
        id: ingrediente.id,
        nome: ingrediente.nome,
        semMedida: ingrediente.semMedida,
        unidades: ingrediente.unidades
      }
    }

    return null;
  },

  renderMany(ingredienteList: Ingrediente[]) {
    return ingredienteList.map(ingrediente => this.render(ingrediente));
  },

  renderManyComplex(ingredienteList: Ingrediente[]) {
    return ;
    //return ingredienteList.map(ingrediente => this.render(ingrediente));
  },

  renderManySimple(ingredienteList: Ingrediente[]) {
    return ingredienteList.map(ingrediente => this.renderSimple(ingrediente));
  }
};