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

<<<<<<< HEAD
interface IIngredientCart {
=======
interface IngredientCart {
>>>>>>> 5af5c3feb5134f234dcf1e64e858a536c756ea08
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

export {
  IRecipe,
  IRecipeType,
  IIngredient,
  IIngredientType,
  IIngredientCart,
  ICategory,
  IComment,
  IVote
}