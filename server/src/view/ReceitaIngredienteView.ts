import { Ingrediente } from "../model/Ingrediente";
import { Medida } from "../model/Medida";
import { ReceitaIngrediente } from "../model/ReceitaIngrediente";
import { TipoUnidade } from "../model/TipoUnidade";
import { Unidade } from "../model/Unidade";

export default {
	render(rI: ReceitaIngrediente) {

		if (rI) {
			const medidasSI: { nome: string, taxaConversao: number, tipo: TipoUnidade }[] = [
				{ nome: 'Mg', taxaConversao: 0.001, tipo: TipoUnidade.PESO },
				{ nome: 'Kg', taxaConversao: 1000, tipo: TipoUnidade.PESO },
				{ nome: 'g', taxaConversao: 1, tipo: TipoUnidade.PESO },
				{ nome: 'L', taxaConversao: 1, tipo: TipoUnidade.VOLUME },
				{ nome: 'Ml', taxaConversao: 0.001, tipo: TipoUnidade.VOLUME }
			];

			let medida: string = `${ rI.quantidade.toString() } `;

			if (rI.ingrediente.tipoUnidade === TipoUnidade.UNIDADE) {
				medida += 'unidade(s)';
			} else if (medidasSI.find(item => item.nome === rI.unidade.medida.nome)) {
				const ingrediente: Ingrediente = rI.ingrediente;
				const unidade: Unidade = rI.unidade;
				const qtde: number = rI.quantidade;
				const medidas: { nome: string, taxaConversao: number, tipo: TipoUnidade }[] = medidasSI.filter(item => item.tipo === ingrediente.tipoUnidade);

				medida += `${ unidade.medida.nome.toLowerCase() } ou `;

				for (var key2 in medidas) {
					const un = medidas[key2];
					const valor = (qtde * (unidade.taxaConversao)) / un.taxaConversao;

					if (valor > 1 && valor < 1000) {
						medida += `${ valor } ${ un.nome }`;
						break;
					}
				}
			} else {
				medida += rI.unidade.medida.nome;
			}

			return {
				id: rI.ingrediente.id,
				nome: rI.ingrediente.nome,
				medida,
				qtde: rI.quantidade
			};
		}

		return null;
	},

	renderMany(rI: ReceitaIngrediente[]) {
		return rI.map(ingrediente => this.render(ingrediente));
	}
};