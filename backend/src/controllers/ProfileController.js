const connection = require('../database/connection');


module.exports = {
    async index(request, response) {
        const ong_id = request.headers.authorization;

        const incidents = await connection('incidents')
            .where('ong_id', ong_id)
            .select('*');

        const [ qtde ] = await connection('incidents')
            .where('ong_id', ong_id)
            .count();

        response.header('X-Total-Count', qtde['count']);

        return response.json(incidents);
    }
}