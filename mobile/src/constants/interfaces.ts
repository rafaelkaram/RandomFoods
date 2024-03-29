interface IAuthContextData {
  nomeReceitaContext: string,
  tipoReceitaContext: string,
  categoriasContext: string[],
  minutosContext: string,
  porcoesContext: string,
  midiasContext: IMidiaPicker[],
  ingredientesContext: ICart[],
  itemsContext: number[],
  ingredientesQuantidadeContext: IIngredienteCadastro[],
  stepsContext: IPassoReceita[],
  saveDadosGerais(nomeReceita: string, tipoReceita: string, categorias: string[], minutos: string, porcoes: string, midias: IMidiaPicker[]): Promise<void>,
  saveIngredientes(ingredientes: ICart[], itemsContext: number[]): Promise<void>,
  saveIngredientesQuantidade(ingredientesQuantidade: IIngredienteCadastro[]): Promise<void>,
  saveSteps(steps: IPassoReceita[]): Promise<void>,
  deleteItems(): Promise<void>,
}

interface IComentario {
  id: number,
  conteudo: string,
  comentarioPai: number | undefined,
  data: Date,
  usuario: IUsuarioSimples,
  idReceita: number
}

interface IComentarioSend {
  conteudo: string,
  comentarioPai: number,
  idUsuario: number,
  idReceita: number
}

interface IComentarioProps {
  comentario: IComentario,
  lista: IComentario[],
  isLogado: boolean,
  setNew: Function,
  setIdPai: Function,
}

interface ICurtidaSimples {
  id: number,
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
  receita: string,
  descricao: string,
  tempoPreparo: number,
  foto?: string,
  usuario: IUsuarioSimples,
  nota: number,
  numNotas: number,
  curtidas: ICurtidaSimples[],
  ingredientes: IIngredienteReceita[],
  midias?: IMidia[],
  categorias: string[],
}

interface IReceitaSimples {
  id: number,
  receita: string,
  tempoPreparo: number,
  foto: string,
  usuario: IUsuarioSimples,
  categorias: string[],
  nota: number,
  numNotas: number,
  curtidas: number,
  comentarios: number,
}

interface ISeguidor {
  id: number,
  usuario: IUsuarioSimples
}

interface IUnidade {
  id: number,
  nome: string,
  incremento: number
}

interface IUsuario {
  id: number,
  idExterno?: string,
  token: string,
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
  notificarCurtida: boolean,
  notificarResposta: boolean,
  notificarMarca: boolean,
  qtdeLogs: number
}

interface IUsuarioSimples {
  id: number,
  login: string,
  nome: string,
  iniciais: string,
  perfil: string,
  path: string,
  ativo: boolean
}

interface ICart {
  id: number,
  nome: string
}

interface IHeader {
  'x-access-token': string
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

interface IMidiaPicker {
  cancelled: boolean,
  type: string,
  uri: string,
  width: number,
  height: number,
  exif?: any,
  base64?: any,
  duration?: any,
}

interface IPainelCategorias {
  categoria: string,
  count: number,
}

interface IPainelTipoReceita {
  tipo: string,
  count: number,
}

interface IPainelCurtidas {
  id: number,
  nome: string,
  curtidas: number,
}

interface IPassoReceita {
  id: number,
  descricao: string,
  edit: boolean,
  update: boolean
}

interface IPassoReceita2 {
  descricao: string,
  edit: boolean
}

interface ISeguidoresSimples {
  id: number,
  seguidor: {
    id: number,
    nome: string
  }
}

interface IIngredienteCadastro {
  id: number,
  nomeIngrediente: string,
  semMedida?: boolean,
  unidade?: string,
  quantidade?: number,
}

interface IIngredienteQuantidade {
  id: number,
  unidade?: string,
  quantidade?: number,
}

export {
  IAuthContextData,
  IComentario,
  IComentarioSend,
  IComentarioProps,
  ICurtidaSimples,
  IIngrediente,
  IMidia,
  IReceita,
  IReceitaSimples,
  ISeguidor,
  IUnidade,
  IUsuario,
  IUsuarioSimples,
  ICart,
  IHeader,
  IIngredienteReceita,
  IListaIngredientes,
  IMidiaPicker,
  IPainelCategorias,
  IPainelTipoReceita,
  IPainelCurtidas,
  IPassoReceita,
  IPassoReceita2,
  ISeguidoresSimples,
  IIngredienteCadastro,
  IIngredienteQuantidade,
}