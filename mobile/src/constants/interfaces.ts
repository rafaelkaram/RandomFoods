interface IRecipe {
  id: number,
  id_usuario: number,
  usuario: string,
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
  image_url: string,
  ingredientes: [{
      id: number,
      nome: string,
      id_tipo_unidade: number,
      id_tipo_ingrediente: number,
      sem_medida: boolean,
      derivado_leite: boolean,
      glutem: boolean
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
  usuario: string,
  id: number,
  id_usuario: number,
  id_receita: number,
  id_pai: number,
  valor: string,
  data: Date,
  avaliacao: number,
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