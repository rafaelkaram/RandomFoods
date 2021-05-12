interface IComentario {
  id: number,
  conteudo: string,
  comentarioPai: number,
  data: Date,
  usuario: IUsuarioSimples
}
interface IIngrediente {
  id: number,
  nome: string,
  gluten?: boolean,
  derivadoLeite?: boolean,
  semMedida?: boolean,
  tipoUnidade?: string,
  unidades?: IUnidade[]
}

interface IMidia {
  id: number,
  path: string,
  tipo: string,
  dataCadastro: Date
}

interface IReceita {
  id: number,
  nome: string,
  descricao: string,
  foto?: string,
  nota: number,
  numNotas: number,
  usuario: IUsuarioSimples,
  ingredientes: IIngredienteReceita[],
  midias?: IMidia[],
  categorias: string[]
}

interface IReceitaSimples {
  id: number,
  nome: string,
  foto: string,
  usuario: IUsuarioSimples,
  categorias: string[],
  nota: number,
  numNotas: number,
}

interface IUnidade {
  id: number,
  nome: string,
  incremento: number
}

interface IUsuario {
  id: number,
  idExterno?: string,
  login: string,
  nome: string,
  iniciais: string,
  email: string,
  perfil: string,
  path: string,
  dataCadastro: Date,
  ativo: boolean,
  trocaLogin: boolean,
  notificarSeguidor: boolean,
  notificarAvaliacao: boolean,
  notificarComentario: boolean,
  notificarFavorito: boolean,
  notificarResposta: boolean,
  notificarMarca: boolean,
  qtdeLogs: number
}

interface IUsuarioSimples {
  id: number,
  login: string,
  nome: string,
  iniciais: string,
  perfil:boolean,
  path: string,
  ativo: boolean
}

interface ICart {
  id: number,
  nome: string
}

interface IIngredienteReceita {
  id: number,
  nome: string,
  medida: string,
  qtde: number,
}

interface IListaIngredientes {
  nome: string,
  url: string,
  ingredientes: IIngrediente[]
}

interface IPainelCategorias {
  nome_categoria: string,
  count: number,
}

interface IPainelTipoReceita {
  tipo: string,
  count: number,
}

interface IPainelVotos {
  id: number,
  nome: string,
  nota: string,
  num_notas: number
}

interface IPassoReceita {
  id: number,
  descricao: string,
  edit: boolean,
  update: boolean
}

export {
  IComentario,
  IIngrediente,
  IMidia,
  IReceita,
  IReceitaSimples,
  IUnidade,
  IUsuario,
  IUsuarioSimples,
  ICart,
  IIngredienteReceita,
  IListaIngredientes,
  IPainelCategorias,
  IPainelTipoReceita,
  IPainelVotos,
  IPassoReceita,
}