const connection = require('../database/connection');

module.exports = {
    async convert(request, response) {
        const { id_origem, id_destino, valor } = request.body;

        if (isNaN(valor)) {
            return response.status(400).json({ error: 'Valor inserido não é um número!'});
        }

        const { unidade_origem, unidade_destino } = await module.exports.findUnits(id_origem, id_destino);
        
        if (!unidade_origem || !unidade_destino) {
            return response.status(400).json({ error: 'Unidade não encontrada!'});
        }

        const valorConvertido = (valor * (unidade_origem.taxa_conversao)) / unidade_destino.taxa_conversao;

        const unidade = unidade_destino.nome;

        return response.json({ unidade, valorConvertido });
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