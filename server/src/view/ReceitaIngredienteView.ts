import { ReceitaIngrediente } from "../model/ReceitaIngrediente";

export default {
	render(rI: ReceitaIngrediente) {
		if (rI) {
		return {
			id: rI.ingrediente.id,
			nome: rI.ingrediente.nome,
			//medida: ingredienteUnidadeView.render(rI.unidade, rI.ingrediente, rI.quantidade),
			qtde: rI.quantidade
		};
		}

		return null;
	},

	renderMany(rI: ReceitaIngrediente[]) {
		return rI.map(ingrediente => this.render(ingrediente));
	}
};