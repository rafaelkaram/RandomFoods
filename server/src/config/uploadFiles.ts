import multer from 'multer';
import util from '../util/util';

export default {
  storage: multer.diskStorage({
    destination: util.getPath('import'),
    filename: (request, file, cb) => {
      const { nome } = request.params;
      const fileName = `${Date.now()}-${ nome ? nome.toUpperCase() : 'RECEITA' }`;

      cb(null, fileName);
    }
  })
}