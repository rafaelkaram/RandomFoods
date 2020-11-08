const connection = require('../database/connection');
const XLSX = require('xlsx');
const path = require('path');
const UsuarioController = require('./UsuarioController');
const ReceitaController = require('./ReceitaController');
const CategoriaController = require('./CategoriaController');
const IngredienteController = require('./IngredienteController');
const UnidadeController = require('./UnidadeController');

module.exports =  {

  async import(req, res) {
    const { fileName } = req.body;

    const workbook = XLSX.readFile(path.join(__dirname, '..', 'database', 'imports', fileName + '.xlsx'));
    //   const sheet_name_list = workbook.SheetNames;

    const sheetReceita = XLSX.utils.sheet_to_json(workbook.Sheets['Receita']);
    const sheetIngrediente = XLSX.utils.sheet_to_json(workbook.Sheets['Ingrediente']);
    const sheetCategoria = XLSX.utils.sheet_to_json(workbook.Sheets['Categoria']);

    const receitas = [];

    for (var key in sheetReceita) {
      const { Nome, Descricao, Tipo, Usuario } = sheetReceita[key];

      let user = await UsuarioController.findByEmail(Usuario);

      if (!user) {
        user = await UsuarioController.findByEmail('randomfoodstcc@gmail.com');
      }

      const categorias = [];

      try {

        for (var key in sheetCategoria) {
          const { Receita, Categoria } = sheetCategoria[key];

          if (Nome !== Receita) {
            continue;
          }

          const categoria = await CategoriaController.fetch(Categoria);

          if (!categoria) {
            throw Error(`Categoria ${Categoria} não encontrada.`);
          }
          categorias.push(categoria.id);
        }

        const ingredientes = [];

        for (var key in sheetIngrediente) {
          const { Receita, Ingrediente, Unidade, Quantidade } = sheetIngrediente[key];

          if (Nome !== Receita) {
            continue;
          }

          const ingrediente = await IngredienteController.fetch(Ingrediente);

          if (!ingrediente) {
            throw Error(`Ingrediente ${Ingrediente} não encontrado.`);
          }

          if (!Quantidade) {

            if (!ingrediente.sem_medida) {
              throw Error(`Ingrediente ${Ingrediente} não aceita quantidades nulas`);
            }

            ingredientes.push({ id: ingrediente.id, id_unidade: null , quantidade: null });

          } else if (ingrediente.id_tipo_unidade === 3) {

            ingredientes.push({ id: ingrediente.id, id_unidade: 6 , quantidade: Quantidade });

          } else {
            const unidade = await UnidadeController.fetch(Unidade, ingrediente);
            ingredientes.push({ id: ingrediente.id, id_unidade: unidade.id , quantidade: Quantidade });
          }

        }

        const receita = await ReceitaController.createImport({
          nome: Nome,
          descricao: Descricao,
          tipo: Tipo,
          user: user.id,
          ingredientes,
          categorias });

        receitas.push(receita);

        console.log(receita);

      } catch (error) {
        console.log('Receita ' + Nome + ' não cadastrada. ' + error);
      }

    }

    res.status(200).json(receitas);
    //res.status(200).json({ sheetReceita, sheetIngrediente, sheetCategoria });
  }
}