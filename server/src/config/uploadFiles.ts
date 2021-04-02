import multer from 'multer';
import Util from '../util/Util';

export default {
  storage: multer.diskStorage({
    destination: Util.getPath('import'),
    filename: (request, file, cb) => {
      const fileName = `${Date.now()}-${file.originalname}`;

      cb(null, fileName);
    }
  })
}