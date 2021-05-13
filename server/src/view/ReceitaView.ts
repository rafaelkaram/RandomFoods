import util from "../util/util";

import { Midia } from "../model/Midia";
import { Receita } from "../model/Receita";
import { ReceitaIngrediente } from "../model/ReceitaIngrediente";

import ingredienteView from "./ReceitaIngredienteView";
import midiaView from "./MidiaView";
import usuarioView from "./UsuarioView";

export default {
  renderSimple(receita: Receita, avaliacao: { nota: number, qtdeNotas: number}, midia?: Midia) {
    const filePath = midia?.path;
    const path = filePath ?
      `http://${ util.getLocalIP() }:${ process.env.PORT }/uploads/midia/receita/${ filePath }` :
      `http://${ util.getLocalIP() }:${ process.env.PORT }/uploads/midia/receita/receita-padrao.png`;

    const categorias = receita.categorias.map(categoria => {
      return categoria.nome;
    });

    return {
      id: receita.id,
      receita: receita.nome,
      tempoPreparo: receita.tempoPreparo,
      foto: path,
      usuario: usuarioView.renderSimple(receita.usuario),
      categorias,
      nota: avaliacao.nota,
      numNotas: avaliacao.qtdeNotas
    };
  },

  render(receita: Receita, ingredienteList: ReceitaIngrediente[], midias: Midia[], avaliacao: { nota: number, qtdeNotas: number}, qtdeLogs: number) {
    if (receita && ingredienteList) {

      return {
        id: receita.id,
        receita: receita.nome,
        descricao: receita.descricao,
        tempoPreparo: receita.tempoPreparo,
        dataCadastro: receita.dataCadastro,
        tipo: receita.tipo,
        usuario: usuarioView.render(receita.usuario, qtdeLogs),
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