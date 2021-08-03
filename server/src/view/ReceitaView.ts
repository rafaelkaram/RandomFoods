import { encryptMidia, getLocalIP } from "../util/util";

import { Curtida } from "../model/Curtida";
import { Midia, Tipo } from "../model/Midia";
import { Receita } from "../model/Receita";
import { ReceitaIngrediente } from "../model/ReceitaIngrediente";

import curtidaView from "./CurtidaView";
import ingredienteView from "./ReceitaIngredienteView";
import midiaView from "./MidiaView";
import usuarioView from "./UsuarioView";

export default {
    renderSimple(receita: Receita, curtidas: number, comentarios: number, avaliacao: { nota: number, qtdeNotas: number}, midia?: Midia) {
		const extensao = midia?.tipo === Tipo.FOTO ? '.png' : '.mp4';
		const filePath = midia?.path + extensao;
		const folderName = encryptMidia(receita.id.toString());
		const path = midia ?
			`http://${ getLocalIP() }:${ process.env.PORT }/uploads/midia/receita/${ folderName }/${ filePath }` :
			`http://${ getLocalIP() }:${ process.env.PORT }/uploads/midia/receita/receita-padrao.png`;

		const categorias = receita.categorias.map(categoria => {
			return categoria.nome;
		});

		return {
			id: receita.id,
			receita: receita.nome,
			tempoPreparo: receita.tempoPreparo,
			foto: path,
			usuario: usuarioView.renderSimple(receita.usuario),
			categorias,
			nota: avaliacao.nota,
			numNotas: avaliacao.qtdeNotas,
			curtidas,
			comentarios
		};
    },

    render(receita: Receita, ingredienteList: ReceitaIngrediente[], curtidaList: Curtida[], avaliacao: { nota: number, qtdeNotas: number}, qtdeLogs: number) {
		if (receita && ingredienteList) {
			const categorias = receita.categorias.map(categoria => {
				return categoria.nome;
			});

			return {
				id: receita.id,
				receita: receita.nome,
				descricao: receita.descricao,
				tempoPreparo: receita.tempoPreparo,
				dataCadastro: receita.dataCadastro,
				tipo: receita.tipo,
				usuario: usuarioView.render(receita.usuario, qtdeLogs),
				curtidas: curtidaView.renderManySimple(curtidaList),
				nota: avaliacao.nota,
				qtdeNotas: avaliacao.qtdeNotas,
				ingredientes: ingredienteView.renderMany(ingredienteList),
				categorias,
				midias: midiaView.renderMany(receita.midias, receita.id)
			};

		}

		return null;
    }
};