import { Curtida } from "../model/Curtida";

import usuarioView from "./UsuarioView";

export default {
    renderSimple(curtida: Curtida) {
        return {
            id: curtida.id,
            usuario: usuarioView.renderSimple(curtida.usuario),
        };
    },
    renderManySimple(curtidas: Curtida[]) {
        return curtidas.map(curtida => this.renderSimple(curtida));
    }
};