import { getLocalIP } from '../util/util';

import { Ingrediente, TipoIngrediente } from "../model/Ingrediente";

import IngredienteView from './IngredienteView';

export default {
	render(ingredientes: any, tipo: TipoIngrediente) {
		return {
			nome: tipo,
			url: `http://${ getLocalIP() }:${ process.env.PORT }/uploads/ingredient-types/${ tipo.toLowerCase() }-colored.png`,
			ingredientes: ingredientes
		};
	},

	renderMany(ingredientes: Ingrediente[], tipo: TipoIngrediente) {
		if (ingredientes && ingredientes.length > 0) {
			const list = IngredienteView.renderMany(ingredientes);

			return this.render(list, tipo);
		}

		return ;
	},

	renderManySimple(ingredientes: Ingrediente[], tipo: TipoIngrediente) {
		if (ingredientes && ingredientes.length > 0) {
			const list = IngredienteView.renderManySimple(ingredientes);

			return this.render(list, tipo);
		}

		return ;
	},

	renderManyComplex(ingredientes: Ingrediente[], tipo: TipoIngrediente) {
		if (ingredientes && ingredientes.length > 0) {
			const list = IngredienteView.renderManyComplex(ingredientes);

			return this.render(list, tipo);
		}

		return null;
	}
};