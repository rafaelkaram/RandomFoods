const express = require('express');

const AvaliacaoController = require('./controllers/AvaliacaoController');
const ComentarioController = require('./controllers/ComentarioController');
const IngredienteController = require('./controllers/IngredienteController');
const ReceitaController = require('./controllers/ReceitaController');
const UsuarioController = require('./controllers/UsuarioController');
const UnidadeController = require('./controllers/UnidadeController');
const TipoUnidadeController = require('./controllers/TipoUnidadeController');
const TipoIngredienteController = require('./controllers/TipoIngredienteController');
const ConversorController = require('./controllers/ConversorController');

const ReceitaIngredienteController = require('./controllers/ReceitaIngredienteController');
const ReceitaCategoriaController = require('./controllers/ReceitaCategoriaController');


const routes = express.Router();

routes.get('/avaliar/user', AvaliacaoController.userIndex);
routes.post('/avaliar/:id_receita', AvaliacaoController.create);

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
routes.post('/session', UsuarioController.validate);
routes.post('/users', UsuarioController.create);
routes.post('/user', UsuarioController.createUnique);
routes.delete('/user/:id', UsuarioController.delete);

routes.get('/ingrediente', IngredienteController.index);
routes.get('/ingrediente/:id', IngredienteController.search);
routes.post('/ingrediente', IngredienteController.createIngredient);
routes.post('/ingredientes', IngredienteController.create);
routes.delete('/ingrediente/:id', IngredienteController.delete);

module.exports = routes;