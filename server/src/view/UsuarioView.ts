import path from 'path';
import fs from 'fs';
import { encryptMidia, getLocalIP, getPath } from '../util/util';

import { Usuario } from "../model/Usuario";

export default {
	renderSimple(usuario: Usuario) {

		if (!usuario) return null;

		const nomeCompleto = usuario.nome.split(" ");
		const tam  = nomeCompleto.length - 1;
		const firstName :string = nomeCompleto[0];
		const lastName :string = nomeCompleto[tam];
		const imgName: string = `${ encryptMidia(usuario.id.toString()) }.png`;
		const existImg: boolean = fs.existsSync(path.join(getPath('usuario'), imgName));

		const imgPath: string = existImg ? `http://${ getLocalIP() }:${ process.env.PORT }/uploads/midia/usuario/${ imgName }` : '';

		return {
			id: usuario.id,
			login: usuario.login,
			nome: usuario.nome,
			iniciais: firstName[0] + lastName[0],
			perfil: usuario.perfil,
			path: imgPath,
			ativo: usuario.ativo
		};
	},

	render(usuario: Usuario, qtdeLogs: number) {

		if (!usuario) return null;

		const nomeCompleto = usuario.nome.split(" ");
		const tam  = nomeCompleto.length - 1;
		const firstName :string = nomeCompleto[0];
		const lastName :string = nomeCompleto[tam];
		const imgName: string = `${ encryptMidia(usuario.id.toString()) }.png`;
		const existImg: boolean = fs.existsSync(path.join(getPath('usuario'), imgName));

		const imgPath: string = existImg ? `http://${ getLocalIP() }:${ process.env.PORT }/uploads/midia/usuario/${ imgName }` : '';

		return {
			id: usuario.id,
			idExterno: usuario.idExterno ? usuario.idExterno : null,
			login: usuario.login,
			nome: usuario.nome,
			iniciais: firstName[0] + lastName[0],
			email: usuario.email,
			perfil: usuario.perfil,
			path: imgPath,
			dataCadastro: usuario.dataCadastro,
			ativo: usuario.ativo,
			trocaLogin: usuario.trocaLogin,
			notificarSeguidor: usuario.notificarSeguidor,
			notificarAvaliacao: usuario.notificarAvaliacao,
			notificarComentario: usuario.notificarComentario,
			notificarCurtida: usuario.notificarCurtida,
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