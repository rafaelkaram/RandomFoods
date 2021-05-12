import util from '../util/util';

import { Usuario } from "../model/Usuario";

export default {
  renderSimple(usuario: Usuario) {

    if (!usuario) return null;

    const nomeCompleto = usuario.nome.split(" ");
    const tam  = nomeCompleto.length - 1;
    const firstName :string = nomeCompleto[0];
    const lastName :string = nomeCompleto[tam];

    return {
      id: usuario.id,
      login: usuario.login,
      nome: usuario.nome,
      iniciais: firstName[0] + lastName[0],
      perfil: usuario.perfil,
      path: `http://${ util.getLocalIP() }:${ process.env.PORT }/uploads/midia/usuario/${util.encryptMidia(usuario.id.toString())}.png`,
      ativo: usuario.ativo
    };
  },

  render(usuario: Usuario, qtdeLogs: number) {

    if (!usuario) return null;

    const nomeCompleto = usuario.nome.split(" ");
    const tam  = nomeCompleto.length - 1;
    const firstName :string = nomeCompleto[0];
    const lastName :string = nomeCompleto[tam];

    return {
      id: usuario.id,
      idExterno: usuario.idExterno ? usuario.idExterno : null,
      login: usuario.login,
      nome: usuario.nome,
      iniciais: firstName[0] + lastName[0],
      email: usuario.email,
      perfil: usuario.perfil,
      path: `http://${ util.getLocalIP() }:${ process.env.PORT }/uploads/midia/usuario/${util.encryptMidia(usuario.id.toString())}.png`,
      dataCadastro: usuario.dataCadastro,
      ativo: usuario.ativo,
      trocaLogin: usuario.trocaLogin,
      notificarSeguidor: usuario.notificarSeguidor,
      notificarAvaliacao: usuario.notificarAvaliacao,
      notificarComentario: usuario.notificarComentario,
      notificarFavorito: usuario.notificarFavorito,
      notificarResposta: usuario.notificarResposta,
      notificarMarca: usuario.notificarMarca,
      qtdeLogs: qtdeLogs
    };
  },

  renderManySimple(usuarios: Usuario[]) {
    return usuarios.map(usuario => this.renderSimple(usuario));
  },

  renderMany(obj: { usuario: Usuario, qtdeLogs: number }[]) {
    return obj.map(item => this.render(item.usuario, item.qtdeLogs));
  }
};