import { Router } from 'express';
import multer from 'multer';

import uploadConfig from './config/upload';

import AvaliacaoService from './service/AvaliacaoService';
import CategoriaService from './service/CategoriaService';
import ComentarioService from './service/ComentarioService';
import FileImportService from './service/FileImportService';
import IngredienteService from './service/IngredienteService';
import ReceitaIngredienteService from './service/ReceitaIngredienteService';
import ReceitaService from './service/ReceitaService';
import UnidadeService from './service/UnidadeService';
import UsuarioService from './service/UsuarioService';

const avaliacaoService = new AvaliacaoService();
const categoriaService = new CategoriaService();
const comentarioService = new ComentarioService();
const fileImportService = new FileImportService();
const ingredienteService = new IngredienteService();
const receitaIngredienteService = new ReceitaIngredienteService();
const receitaService = new ReceitaService();
const unidadeService = new UnidadeService();
const usuarioService = new UsuarioService();

const routes = Router();
const upload = multer(uploadConfig);


// Rotas de cadastro
// Utilizar parametros através do body da requisição
routes.post('/cadastro/avaliacao', avaliacaoService.create);
routes.post('/cadastro/comentario', comentarioService.create);
routes.post('/cadastro/ingrediente', ingredienteService.create);
routes.post('/cadastro/ingredientes', ingredienteService.createBulk);
routes.post('/cadastro/receita', receitaService.create);
routes.post('/cadastro/unidade', unidadeService.create);
routes.post('/cadastro/unidades', unidadeService.createBulk);
routes.post('/cadastro/usuario', usuarioService.create);
routes.post('/cadastro/usuarios', usuarioService.createBulk);

// Rotas de busca (buscar todos)
// Utilizar parametros através de query ou endereço
routes.get('/busca/ingredientes', ingredienteService.index);
routes.get('/busca/tipo-ingrediente', ingredienteService.typeIndex);
routes.get('/busca/receita', receitaService.index);
routes.get('/busca/unidade', unidadeService.index);
routes.get('/busca/unidade-ingrediente', unidadeService.list);
routes.get('/busca/usuario', usuarioService.index);

// Rotas de busca (buscar único)
// Utilizar parametros através de query ou endereço
routes.get('/busca/comentario/:id', comentarioService.fetch);
routes.get('/busca/ingrediente/:id', ingredienteService.fetch);
routes.get('/busca/receita/:id', receitaService.fetch);
routes.get('/busca/unidade/:id', unidadeService.fetch);

// Rotas de busca (busca personalizada)
// Utilizar parametros através de query ou endereço
routes.get('/busca/comentario/:idReceita', comentarioService.findByReceita);
routes.get('/busca/receita/:idUsuario', receitaService.findByUser);
routes.get('/busca/receita-ingrediente', receitaIngredienteService.findPerfectMatch);      // Usa

// Rotas Dashboard
// Utilizar parametros através de query ou endereço
routes.get('/dashboard/avaliacoes/:id', avaliacaoService.findVoted);
routes.get('/dashboard/categorias/:id', categoriaService.countCategoryByUserId);
routes.get('/dashboard/tipos-receita/:id', receitaService.countTypeByUserId);


// Rotas de remoção
routes.delete('/remove/ingrediente/:id', ingredienteService.remove);
routes.delete('/remove/unidade/:id', unidadeService.remove);
routes.delete('/remove/usuario/:id', usuarioService.remove);
//routes.delete('/remove/receita/:id', receitaService.remove);

// Demais rotas
routes.post('/autenticar', usuarioService.validate); // ??? Manter?

export default routes;