import { Usuario } from "../entity/Usuario";
import util from '../util/util';

export default {
  render(usuario: Usuario) {
    if (usuario && false/*usuario.idAlt*/) {
      return {
        id: usuario.id,
        nome: usuario.nome,
        nomeUsuario: '@'
      };
    } else if (usuario) {
      return {
        id: usuario.id,
        nome: usuario.nome,
        path: `http://${ util.getLocalIP() }:${ process.env.PORT }/uploads/midia/usuario/${util.encryptMidia(usuario.id.toString())}.png`,
        nomeUsuario: '@'
      };
    }

    return null;
  },

  renderMany(usuarios: Usuario[]) {
    return usuarios.map(usuario => this.render(usuario));
  }
};