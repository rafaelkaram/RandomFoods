import { Usuario } from "../entity/Usuario";

export default {
  render(usuario: Usuario) {
    if (usuario && false/*usuario.idAlt*/) {
      return {
        id: usuario.id,
        nome: usuario.nome,
        path: '',
        nomeUsuario: '@'
      };
    } else if (usuario) {
      return {
        id: usuario.id,
        nome: usuario.nome,
        path: '',
        nomeUsuario: '@'
      };
    }

    return null;
  },

  renderMany(usuarios: Usuario[]) {
    return usuarios.map(usuario => this.render(usuario));
  }
};