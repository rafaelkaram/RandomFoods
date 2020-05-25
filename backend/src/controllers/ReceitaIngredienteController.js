const connection = require('../database/connection');

module.exports = {
    async convert(request, response) {
        const { id_origem, id_destino, valor } = request.body;

        console.log({ id_origem, id_destino, valor });

        if (isNaN(valor)) {
            return response.status(400).json({ error: 'Valor inserido não é um número!'});
        }

        const { unidade_origem, unidade_destino } = await module.exports.findUnits(id_origem, id_destino);
        

        if (!unidade_origem || !unidade_destino) {
            return response.status(400).json({ error: 'Unidade não encontrada!'});
        }

        if (unidade_origem.id_tipo_unidade != unidade_destino.id_tipo_unidade) {
            return response.status(400).json({ error: 'Unidade são de tipos diferentes!'});
                    }


        const valorAnterior = valor;

        const valorConvertido = (valor * (unidade_origem.taxa_conversao)) / unidade_destino.taxa_conversao;

        const unidadeAnterior = unidade_origem.nome;

        const unidadeAtual = unidade_destino.nome;

        return response.json({ unidadeAnterior, unidadeAtual, valorAnterior, valorConvertido });
    },

    findUnits: async function (id_origem, id_destino) { 
        const unidade_origem =  await connection('unidade')
            .where('id', id_origem)
            .select('*')
            .first();

        const unidade_destino = await connection('unidade')
            .where('id', id_destino)
            .select('*')
            .first();

        return { unidade_origem, unidade_destino };
    }
}