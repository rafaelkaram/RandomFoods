const express = require('express');

const AvaliacaoController = require('./controllers/AvaliacaoController');
const ComentarioController = require('./controllers/ComentarioController');
const IngredienteController = require('./controllers/IngredienteController');
const ReceitaController = require('./controllers/ReceitaController');
const UsuarioController = require('./controllers/UsuarioController');
const UnidadeController = require('./controllers/UnidadeController');
const TipoUnidadeController = require('./controllers/TipoUnidadeController');
const TipoIngredienteController = require('./controllers/TipoIngredienteController');
const CategoriaController = require('./controllers/CategoriaController');
const ConversorController = require('./controllers/ConversorController');

const ReceitaIngredienteController = require('./controllers/ReceitaIngredienteController');
const ReceitaCategoriaController = require('./controllers/ReceitaCategoriaController');

const ExcelReaderController = require('./controllers/ExcelReaderController');

const routes = express.Router();

routes.get('/avaliar/user', AvaliacaoController.userIndex);
routes.get('/avaliar/:id', AvaliacaoController.search);
routes.post('/avaliar/:id_receita/:id_usuario', AvaliacaoController.create);

// routes.get('/comentar/user', ComentarioController.userIndex);
routes.get('/comentar/:id', ComentarioController.search);
routes.post('/comentar/:id_receita/:id_usuario', ComentarioController.create);

routes.post('/converter', ConversorController.convert);

routes.get('/unidadeList', UnidadeController.list);
routes.get('/unidade', UnidadeController.index);
routes.get('/unidade/:id', UnidadeController.search);
routes.post('/unidade', UnidadeController.create);
routes.delete('/unidade/:id', UnidadeController.delete);

routes.get('/receita', ReceitaController.index);
routes.get('/receitas', ReceitaController.fetch);
routes.get('/receita/:id', ReceitaController.search);
routes.post('/receita', ReceitaController.create);
routes.delete('/receita/:id', ReceitaController.delete);
routes.post('/receitasByIngredient', ReceitaController.searchByIngredient);


routes.get('/tipo-unidade', TipoUnidadeController.index);
routes.get('/tipo-unidades', TipoUnidadeController.list);
routes.get('/tipo-unidade/:id', TipoUnidadeController.search);
routes.post('/tipo-unidade', TipoUnidadeController.create);
routes.delete('/tipo-unidade/:id', TipoUnidadeController.delete);

routes.get('/tipo-ingrediente', TipoIngredienteController.index);
routes.get('/tipo-ingredientes', TipoIngredienteController.list);
routes.get('/tipo-ingrediente/:id', TipoIngredienteController.search);
routes.post('/tipo-ingrediente', TipoIngredienteController.create);
routes.delete('/tipo-ingrediente/:id', TipoIngredienteController.delete);

routes.get('/user', UsuarioController.index);
routes.get('/recipesType/:id',UsuarioController.recipeType);
routes.get('/recipesCategory/:id',UsuarioController.recipeCategory);
routes.get('/topVotedRecipe/:id',UsuarioController.topVotedRecipe);
routes.post('/session', UsuarioController.validate);
routes.post('/users', UsuarioController.create);
routes.post('/user', UsuarioController.createUnique);
routes.delete('/user/:id', UsuarioController.delete);


routes.get('/categorias', CategoriaController.index);

routes.get('/ingrediente', IngredienteController.index);
routes.get('/ingrediente/:id', IngredienteController.search);
routes.post('/ingrediente', IngredienteController.createIngredient);
routes.post('/ingredientes', IngredienteController.create);
routes.delete('/ingrediente/:id', IngredienteController.delete);
routes.get('/ingredientetype', IngredienteController.ingredientType);

//routes.get('/excel', ExcelReaderController.read);
routes.get('/recing/:id', ReceitaIngredienteController.list);
routes.post('/excel', ExcelReaderController.import);

module.exports = routes;