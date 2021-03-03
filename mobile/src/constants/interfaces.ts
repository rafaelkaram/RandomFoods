interface IComment {
  filter(arg0: ({ obj }: { obj: any; }) => boolean): Comment,
  usuario: string,
  id: number,
  id_usuario: number,
  id_receita: number,
  id_pai: number,
  valor: string,
  data: Date,
  avaliacao: number,
}

interface IRecipe {
  id: number,
  id_usuario: number,
  receita: string,
  descricao: string,
  nota: number,
  num_notas: number,
  tipo: string,
  data_cadastro: Date,
  ativa: boolean,
  ingredientes: [{
      id: number,
      nome: string,
      quantidade: number,
  }],
  categorias: [string],
}

export {
  IComment,
  IRecipe
}