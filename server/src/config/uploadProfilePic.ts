import multer from 'multer';
import util from '../util/util';

export default {
  storage: multer.diskStorage({
    destination: util.getPath('usuario'),
    filename: (request, file, cb) => {
      const userId: string | undefined = request.headers.authorization;
      const originalName: string = file.originalname;
      const extensao: string | undefined = originalName.split('.').pop();
      const buffer = util.encryptMidia(userId);
      const fileName: string = `${ buffer }.${ extensao }`;

      cb(null, fileName);
    }
  })
}