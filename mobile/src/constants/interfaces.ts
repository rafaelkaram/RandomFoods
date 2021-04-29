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
  midias: [{
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

interface IIngredienteTipo {
  nome: string,
  url: string,
  alt_url: string,
  ingredientes: IIngrediente[],
}

interface IIngrediente {
  id: number,
  nome: string,
  semMedida: boolean,
  tipoUnidade: string,
  unidades: [{
    id: number,
    nome: string,
    sigla: string,
    taxaConversao: string,
    tipo: string,
    qtd: number
  }]

}

interface IIngrediente2 {
  id: number,
  nome: string,
  semMedida: boolean,
  derivadoLeite: boolean,
  gluten: boolean,
  tipoIngrediente: string,
  tipoUnidade: string
}

interface IIngredientType {
  nome: string,
  url: string,
  alt_url: string,
  ingredientes: IIngrediente2[]
}

interface IIngredientCart {
  id: number,
  nome: string,
}
interface IUnidade {
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
  usuario: {
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

interface IRecipeStep{
  id:number,
  descricao: string,
  edit:boolean,
}

export {
  IRecipe,
  IRecipeType,
  IIngredienteTipo,
  IIngrediente,
  IIngrediente2,
  IIngredientType,
  IIngredientCart,
  IUnidade,
  ICategory,
  IComment,
  IVote,
  IUser,
  IRecipeStep,
}