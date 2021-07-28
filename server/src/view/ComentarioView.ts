import { Comentario } from "../model/Comentario";

import usuarioView from "./UsuarioView";

export default {
    render(comentario: Comentario) {
        return {
            id: comentario.id,
            conteudo: comentario.valor,
            comentarioPai: comentario.comentarioPai?.id,
            data: comentario.data,
            usuario: usuarioView.renderSimple(comentario.usuario),
        };
    },
    renderMany(comentarios: Comentario[]) {
        return comentarios.map(comentario => this.render(comentario));
    }
};