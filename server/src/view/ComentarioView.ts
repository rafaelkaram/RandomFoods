import { Comentario } from "../model/Comentario";

import usuarioView from "./UsuarioView";

export default {
    render(comentario: Comentario) {
        const idPai = comentario.comentarioPai ? comentario.comentarioPai.id : null;

        return {
            id: comentario.id,
            conteudo: comentario.valor,
            comentarioPai: comentario.comentarioPai,
            data: Date,
            usuario: usuarioView.renderSimple(comentario.usuario),
        };
    },
    renderMany(comentarios: Comentario[]) {
        return comentarios.map(comentario => this.render(comentario));
    }
};