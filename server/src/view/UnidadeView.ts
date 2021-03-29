import { Unidade } from "../entity/Unidade";

export default {
  render(unidade: Unidade) {
    if (unidade.ingrediente) {
      return {
        id: unidade.id,
        nome: unidade.nome,
        valor: unidade.nome
      };
    }

    return {
      id: unidade.id,
      nome: unidade.nome,
      valor: `${ unidade.nome } (${ unidade.sigla })`
    };
  },

  renderMany(unidades: Unidade[]) {
    return unidades.map(unidade => this.render(unidade));
  }
};