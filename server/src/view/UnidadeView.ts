import { Unidade } from "../model/Unidade";

export default {
	render(unidade: Unidade) {
		return {
			id: unidade.id,
			nome: unidade.medida.nome,
			incremento: unidade.medida.valor
		};
	},

	renderComplex(unidade: Unidade) {
		return {
			id: unidade.id,
			nome: unidade.medida.nome,
			ingrediente: unidade.ingrediente,
			incremento: unidade.medida.valor
		};
	},

	renderMany(unidades: Unidade[]) {
		return unidades.map(unidade => this.render(unidade));
	},

	renderManyComplex(unidades: Unidade[]) {
		return unidades.map(unidade => this.renderComplex(unidade));
	}
};