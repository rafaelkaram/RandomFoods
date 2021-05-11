import multer from 'multer';
import util from '../util/util';

export default {
  storage: multer.diskStorage({
    destination: util.getPath('import'),
    filename: (request, file, cb) => {
      const { nome } = request.params;
      const originalName: string = file.originalname;
      const extensao: string | undefined = originalName.split('.').pop();
      const fileName = `${Date.now()}-${ nome ? nome.toUpperCase() : 'RECEITA' }.${ extensao }`;

      cb(null, fileName);
    }
  })
}