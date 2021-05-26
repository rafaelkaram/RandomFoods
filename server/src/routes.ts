import { Router } from 'express';
import multer     from 'multer';

import uploadFilesConfig        from './config/uploadFiles';
import uploadMidiaConfig        from './config/uploadMidia';
import uploadProfilePicConfig   from './config/uploadProfilePic';

import AvaliacaoController      from './controller/AvaliacaoController';
import CategoriaController      from './controller/CategoriaController';
import ComentarioController     from './controller/ComentarioController';
import FileImportController     from './controller/FileImportController';
import IngredienteController    from './controller/IngredienteController';
import LogNotificacaoController from './controller/LogNotificacaoController';
import MidiaController          from './controller/MidiaController';
import ReceitaController        from './controller/ReceitaController';
import UnidadeController        from './controller/UnidadeController';
import UsuarioController        from './controller/UsuarioController';

const avaliacaoController       = new AvaliacaoController();
const categoriaController       = new CategoriaController();
const comentarioController      = new ComentarioController();
const fileImportController      = new FileImportController();
const ingredienteController     = new IngredienteController();
const logNotificacaoController  = new LogNotificacaoController();
const midiaController           = new MidiaController();
const receitaController         = new ReceitaController();
const unidadeController         = new UnidadeController();
const usuarioController         = new UsuarioController();

const routes = Router();
const uploadFiles      = multer(uploadFilesConfig);
const uploadMidia      = multer(uploadMidiaConfig);
const uploadProfilePic = multer(uploadProfilePicConfig);

// Rotas de importação
routes.post('/importacao/receita', uploadFiles.array('files'), fileImportController.createRecipe);
routes.post('/importacao/:nome', uploadFiles.array('files'), fileImportController.create);

// Rotas de cadastro
// Utilizar parametros através do body da requisição
routes.post('/cadastro/receita', uploadMidia.array('midias'), receitaController.create);
routes.post('/cadastro/midia', uploadMidia.array('midias'), midiaController.create);
/*
routes.post('/cadastro/avaliacao', avaliacaoController.create);
routes.post('/cadastro/comentario', comentarioController.create);
routes.post('/cadastro/imagem-perfil', uploadProfilePic.single('image'), usuarioController.uploadImage);
routes.post('/cadastro/usuario', usuarioController.create);
routes.post('/cadastro/usuarios', usuarioController.createBulk);
*/
// Rotas de busca (buscar todos)
// Utilizar parametros através de query ou endereço
routes.get('/busca/tipo-receita', receitaController.typeIndex);
routes.get('/busca/tipo-ingrediente', ingredienteController.typeIndex);
routes.get('/busca/categoria', categoriaController.index);
routes.get('/busca/ingrediente', ingredienteController.index);
routes.get('/busca/receita', receitaController.index);
routes.get('/busca/usuario', usuarioController.index);
routes.get('/busca/unidade', unidadeController.index);

// Rotas de busca (buscar único)
routes.get('/busca/receita/:id', receitaController.fetch);
/*
routes.get('/busca/comentario/:id', comentarioController.fetch);
routes.get('/busca/ingrediente/:id', ingredienteController.fetch);
routes.get('/busca/unidade/:id', unidadeController.fetch);
routes.get('/busca/usuario/:id', usuarioController.fetch);
*/

// Rotas de busca (busca personalizada)
routes.get('/busca/ingrediente', ingredienteController.findByIds);
routes.get('/busca/comentario-receita/:idReceita', comentarioController.findByReceita);
routes.get('/busca/combinacoes', receitaController.findMatches);
//routes.get('/busca/receita-usuario/:idUsuario', receitaController.findByUser);

// Rotas Dashboard
routes.get('/dashboard/avaliacoes/:id', avaliacaoController.findVoted);
routes.get('/dashboard/categorias/:id', categoriaController.countCategoryByUserId);
routes.get('/dashboard/tipos-receita/:id', receitaController.countTypeByUserId);

// Rotas de remoção
routes.post('/remove/usuario/:id', usuarioController.remove);
routes.post('/remove/receita/:id', receitaController.remove);

// Demais rotas
//routes.post('/autenticar', usuarioController.validate);
routes.get('/folder-name/:id', fileImportController.getFolderPath);
routes.get('/atualiza-pasta', fileImportController.getNewFolderPath);

export default routes;