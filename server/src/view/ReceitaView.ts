import { Midia } from "../entity/Midia";
import { Receita } from "../entity/Receita";
import { ReceitaIngrediente } from "../entity/ReceitaIngrediente";

import ingredienteView from "./IngredienteView";
import midiaView from "./MidiaView";
import usuarioView from "./UsuarioView";

export default {
  render(receita: Receita, ingredienteList: ReceitaIngrediente[], midias: Midia[], avaliacao: { nota: number, qtdeNotas: number}) {
    if (receita && ingredienteList) {

      return {
        id: receita.id,
        receita: receita.nome,
        descricao: receita.descricao,
        dataCadastro: receita.dataCadastro,
        tipo: receita.tipo,
        usuario: usuarioView.render(receita.usuario),
        nota: avaliacao.nota,
        qtdeNotas: avaliacao.qtdeNotas,
        ingredientes: ingredienteView.renderMany(ingredienteList),
        categorias: receita.categorias,
        midias: midiaView.renderMany(midias)
      };

    }

    return null;
  }
};