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
  midias: [string],
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
  id_tipo_unidade: number,
  id_tipo_ingrediente: number,
  sem_medida: boolean,
  derivado_leite: boolean,
  glutem: boolean
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
  ingredient: {
    id: number,
    name: string
  }
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
  ICategory,
  IComment,
  IVote,
  IUser
}