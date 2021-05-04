import { Usuario } from "../entity/Usuario";
import util from '../util/util';

export default {
  render(usuario: Usuario) {

    const nomeCompleto = usuario.nome.split(" ");
    const tam  = nomeCompleto.length - 1;
    const firstName :string = nomeCompleto[0];
    const lastName :string = nomeCompleto[tam];
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
        iniciais: firstName[0] + lastName[0],
        path: `http://${ util.getLocalIP() }:${ process.env.PORT }/uploads/midia/usuario/${util.encryptMidia(usuario.id.toString())}.png`,
        nomeUsuario: '@',

      };
    }

    return null;
  },

  renderMany(usuarios: Usuario[]) {
    return usuarios.map(usuario => this.render(usuario));
  }
};