import multer from 'multer';
import util from '../util/util';

export default {
  storage: multer.diskStorage({
    destination: util.getPath('import'),
    filename: (request, file, cb) => {
      const fileName = `${Date.now()}-${file.originalname}`;

      cb(null, fileName);
    }
  })
}