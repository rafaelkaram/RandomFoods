const express = require('express');

const AvaliacaoController = require('./controllers/AvaliacaoController');
const ComentarioController = require('./controllers/ComentarioController');
const IngredienteController = require('./controllers/IngredienteController');
const ReceitaController = require('./controllers/ReceitaController');
const UsuarioController = require('./controllers/UsuarioController');
const UnidadeController = require('./controllers/UnidadeController');
const TipoUnidadeController = require('./controllers/TipoUnidadeController');
const ConversorController = require('./controllers/ConversorController');

const routes = express.Router();

routes.get('/avaliar/user', AvaliacaoController.userIndex);
routes.post('/avaliar/:id_receita', AvaliacaoController.create);

routes.get('/converter', ConversorController.convert);

routes.get('/unidade', UnidadeController.index);
routes.get('/unidade/:id', UnidadeController.search);
routes.post('/unidade', UnidadeController.create);
routes.delete('/unidade/:id', UnidadeController.delete);

routes.get('/tipo-unidade', TipoUnidadeController.index);
routes.get('/tipo-unidade/:id', TipoUnidadeController.search);
routes.post('/tipo-unidade', TipoUnidadeController.create);
routes.delete('/tipo-unidade/:id', TipoUnidadeController.delete);

routes.get('/user', UsuarioController.index);
routes.post('/user', UsuarioController.create);
routes.delete('/user/:id', UsuarioController.delete);

routes.post('/ingrediente', IngredienteController.create);

module.exports = routes;