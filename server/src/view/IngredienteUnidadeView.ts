import { Ingrediente } from "../entity/Ingrediente";
import { Unidade } from "../entity/Unidade";
import UnidadeService from "../service/UnidadeService";

export default {
  render(unidade: Unidade, ingrediente: Ingrediente, qtde: number) {
    if (!qtde || qtde === 0 || !unidade) {
      return null;
    } else if (!ingrediente.tipoUnidade || !unidade.ingrediente) {
      return `${ qtde } ${ unidade.sigla }`;
    } else {
      const unidadeService = new UnidadeService();
      const unidadesSI: Unidade[] = unidadeService.findSI(ingrediente.tipoUnidade);

      unidadesSI.map(unSI => {
        const valor = (qtde * unidade.taxaConversao) / unSI.taxaConversao;

        if (valor > 1 && valor < 1000) {
          return `${ qtde } ${ unidade.sigla } ou ${ valor } ${ unSI.sigla }`;
        }
      });
    }
  }
}