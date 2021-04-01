import { getCustomRepository } from "typeorm";

import { MidiaRepository } from "../repository/MidiaRepository";

import { Midia } from "../entity/Midia";

class MidiaService {
    // Métodos internos
    async findByReceita(id: number): Promise<Midia[]> {
        const repository = getCustomRepository(MidiaRepository);

        const midias = await repository.findByReceita(id);

        return midias;
    }
}

export default MidiaService;