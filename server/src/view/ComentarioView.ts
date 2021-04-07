import { Comentario } from "../entity/Comentario";

import usuarioView from "./UsuarioView";

export default {
    render(comentario: Comentario) {
        const idPai = comentario.comentarioPai ? comentario.comentarioPai.id : null;
        
        return {
            id: comentario.id,
            valor: comentario.valor,
            data: comentario.data,
            comentarioPai: idPai,
            usuario: usuarioView.render(comentario.usuario),
        };
    },
    renderMany(comentarios: Comentario[]) {
        return comentarios.map(comentario => this.render(comentario));
    }
};