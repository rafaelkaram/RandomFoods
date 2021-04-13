import { Midia } from "../entity/Midia";
import { Receita } from "../entity/Receita";

import midiaView from "./MidiaView";
import usuarioView from "./UsuarioView";

export default {
    render(receita: Receita, avaliacao: { nota: number, qtdeNotas: number }) {
        if (receita) {
            return {
                id: receita.id,
                receita: receita.nome,
                dataCadastro: receita.dataCadastro,
                tipo: receita.tipo,
                nota: avaliacao.nota,
                qtdeNotas: avaliacao.qtdeNotas,
                midias: midiaView.renderMany(receita.midias)
            };

        }

        return null;
    }
};