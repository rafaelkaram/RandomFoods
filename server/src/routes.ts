import { Router } from 'express';
import multer     from 'multer';

import jwt from './middleware/auth';

import uploadFilesConfig        from './config/uploadFiles';
import uploadMidiaConfig        from './config/uploadMidia';
import uploadProfilePicConfig   from './config/uploadProfilePic';

import CategoriaController      from './controller/CategoriaController';
import ComentarioController     from './controller/ComentarioController';
import CurtidaController        from './controller/CurtidaController';
import FileImportController     from './controller/FileImportController';
import IngredienteController    from './controller/IngredienteController';
import MidiaController          from './controller/MidiaController';
import ReceitaController        from './controller/ReceitaController';
import SeguidorController       from './controller/SeguidorController';
import UnidadeController        from './controller/UnidadeController';
import UsuarioController        from './controller/UsuarioController';

const categoriaController       = new CategoriaController();
const comentarioController      = new ComentarioController();
const curtidaController         = new CurtidaController();
const fileImportController      = new FileImportController();
const ingredienteController     = new IngredienteController();
const midiaController           = new MidiaController();
const receitaController         = new ReceitaController();
const seguidorController        = new SeguidorController();
const unidadeController         = new UnidadeController();
const usuarioController         = new UsuarioController();

const routes = Router();
const uploadFiles      = multer(uploadFilesConfig);
const uploadMidia      = multer(uploadMidiaConfig);
const uploadProfilePic = multer(uploadProfilePicConfig);

// Rotas de importação
routes.post('/importacao/receita', jwt.adminAuth, uploadFiles.array('files'), fileImportController.createRecipe);
routes.post('/importacao/:nome', jwt.adminAuth, uploadFiles.array('files'), fileImportController.create);

// Rotas de cadastro
// Utilizar parametros através do body da requisição
routes.post('/cadastro/receita', jwt.authorization, uploadMidia.array('midias'), receitaController.create);
routes.post('/cadastro/midia', jwt.authorization, uploadMidia.array('midias'), midiaController.create);
routes.post('/cadastro/usuario', uploadProfilePic.single('image'), usuarioController.create);
routes.post('/cadastro/comentario', jwt.authorization, comentarioController.create);
routes.post('/cadastro/curtida', jwt.authorization, curtidaController.create);
routes.post('/cadastro/seguidor', jwt.authorization, seguidorController.create);

// Rtoas de edição
// Utilizar parametros através do body
routes.post('/edicao/usuario', jwt.authorization, uploadProfilePic.single('image'), usuarioController.update);

// Rotas de busca (buscar todos)
// Utilizar parametros através de query ou endereço
routes.get('/busca/tipo-receita', receitaController.typeIndex);
routes.get('/busca/tipo-ingrediente', ingredienteController.typeIndex);
routes.get('/busca/categoria', categoriaController.index);
routes.get('/busca/ingredientes', jwt.adminAuth, ingredienteController.index);
routes.get('/busca/receita', receitaController.index);
routes.get('/busca/usuario', jwt.adminAuth, usuarioController.index);
routes.get('/busca/unidade', jwt.adminAuth, unidadeController.index);
routes.get('/busca/seguidores', jwt.adminAuth, seguidorController.index);

// Rotas de busca (buscar único)
routes.get('/busca/receita/:id', receitaController.fetch);
routes.get('/busca/usuario/:id', usuarioController.fetch);

// Rotas de busca (busca personalizada)
routes.get('/busca/ingrediente', ingredienteController.findByIds);
routes.get('/busca/comentario-receita/:idReceita', comentarioController.findByReceita);
routes.get('/busca/combinacoes', receitaController.findMatches);
routes.get('/busca/receita-categoria', jwt.authorization, receitaController.findByCategorias);
routes.get('/busca/home', jwt.identify, receitaController.findHome);
routes.get('/busca/tempo-preparo', receitaController.getTempoPreparo);
routes.get('/busca/receita-usuario/:id', receitaController.findByUsuario);
routes.get('/busca/seguidos/:id', seguidorController.findByUsuario);
routes.get('/busca/seguidores/:id', seguidorController.findSeguidosByUsuario);

// Rotas Dashboard
routes.get('/dashboard/curtidas', jwt.authorization, curtidaController.findTopCurtidas);
routes.get('/dashboard/categorias', jwt.authorization, categoriaController.countCategoryByUserId);
routes.get('/dashboard/tipos-receita', jwt.authorization, receitaController.countTypeByUserId);

// Rotas de remoção
routes.get('/remove/receita/:id', jwt.authorization, receitaController.remove);
routes.delete('/remove/curtida/:id', jwt.authorization, curtidaController.remove);
routes.delete('/remove/seguidor/:id', jwt.authorization, seguidorController.remove);
routes.delete('/remove/usuario/:id', jwt.adminAuth, usuarioController.remove);

// Demais rotas
routes.post('/validacao', usuarioController.exist);
routes.post('/login-admin', usuarioController.loginAdmin);
routes.post('/fb-login', usuarioController.fbLogin);
routes.post('/login', usuarioController.login);
routes.get('/nome-pasta/:id', jwt.adminAuth, fileImportController.getFolderPath);
routes.get('/atualiza-pasta', jwt.adminAuth, fileImportController.getNewFolderPath);

export default routes;