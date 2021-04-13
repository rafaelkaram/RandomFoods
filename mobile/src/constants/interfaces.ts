interface IRecipe {
  id: number,
  receita: string,
  descricao: string,
  nota: number,
  qtdeNotas: number,
  tipo: string,
  dataCadastro: Date,
  ingredientes: [{
    id: number,
    nome: string,
    qtde: number,
  }],
  usuario: {
    id: number,
    nome: string,
    nomeUsuario: string,
    path: string,
  },
  midias:[{
    id: number,
    url: string
  }],
  categorias: [{
    id: number,
    nome: string,
  }]
}

interface IRecipeType {
  tipo: string,
  count: number,
}

interface IIngredient {
  id: number,
  nome: string,
  tipoUnidade: string,
  //id_tipo_ingrediente: number,
  semMedida: boolean,
  //derivadoLeite: boolean,
  //glutem: boolean,
  unidades: IUnidade[],
  url: string,
}

interface IIngredientType {
  tipo: string,
  url: string,
  alt_url: string,
  ingredientes: [{
    id: number,
    nome: string,
    semMedida: boolean,
    derivadoLeite: boolean,
    gluten: boolean,
    tipoIngrediente: string,
    tipoUnidade: string
  }]
}

interface IIngredientCart {
  id: number,
  nome: string,
}
interface IUnidade{
  id: number,
  nome: string,
  sigla: string,
  taxaConversao: string,
  tipo: string,
}

interface ICategory {
  nome_categoria: string,
  count: number,
}

interface IComment {
  filter(arg0: ({ obj }: { obj: any; }) => boolean): Comment,
  id: number,
  comentarioPai: number,
  valor: string,
  data: Date,
  usuario:{
    id: number,
    nome: string,
    path: string,
    nomeUsuario: string,
  }
}

interface IVote {
  id: number,
  nome: string,
  nota: string,
  num_notas: number
}

interface IUser {
  id: number,
  nome: string,
  email: string,
  data_cadastro: Date,
  data_ultimo_acesso: Date,
  data_ultima_acao: Date,
  ativo: boolean
}

export {
  IRecipe,
  IRecipeType,
  IIngredient,
  IIngredientType,
  IIngredientCart,
  IUnidade,
  ICategory,
  IComment,
  IVote,
  IUser
}