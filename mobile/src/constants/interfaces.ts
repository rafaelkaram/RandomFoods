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
  nota: number,
  numNotas: number,
  usuario: IUsuarioSimples,
  ingredientes: IIngredienteReceita[],
  midias?: IMidia[],
  categorias: string[]
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
  perfil:string,
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

interface IPassoReceita2 {
  descricao: string,
  edit: boolean
}

export {
  IComentario,
  IComentarioSend,
  IComentarioProps,
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
  IMidiaPicker,
  IPainelCategorias,
  IPainelTipoReceita,
  IPainelVotos,
  IPassoReceita,
  IPassoReceita2
}