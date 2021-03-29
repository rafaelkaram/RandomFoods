import { Request, Response } from 'express';

class FileImportService {
    // Métodos internos
    async create(request: Request, response: Response): Promise<any> {
        /*async createImport(request) {
                const { nome, descricao, tipo, ingredientes, categorias, user } = request;

                const trx = await connection.transaction();

                const [id] = await trx('receita')
                    .returning('id')
                    .insert({
                        nome,
                        descricao,
                        tipo,
                        ativa: true,
                        id_usuario: user
                    });

                const idsIngrediente = [];

                for (var key in ingredientes) {
                    const ingrediente = ingredientes[key];

                    const [idIngredienteReceita] = await trx('receita_ingrediente')
                        .returning('id')
                        .insert({
                            id_ingrediente: ingrediente.id,
                            id_receita: id,
                            id_unidade: ingrediente.id_unidade,
                            quantidade: ingrediente.quantidade ? ingrediente.quantidade : null
                        });

                    if (!idIngredienteReceita) {

                    }

                    idsIngrediente.push(idIngredienteReceita);
                }

                const idsCategoria = [];

                for (var key in categorias) {
                    const categoria = categorias[key];

                    const [idCategoria] = await trx('receita_categoria')
                        .returning('id')
                        .insert({
                            id_categoria: categoria,
                            id_receita: id
                        });

                    idsCategoria.push(idCategoria);
                }

                await trx.commit();

                return { id, ingredientes: idsIngrediente, categorias: idsCategoria };
            }*/


        return response.status(400).json({ error: 'Metodo não terminado' });
    }
}

export default FileImportService;