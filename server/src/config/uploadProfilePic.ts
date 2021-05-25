import multer from 'multer';
import { encryptMidia, getPath } from '../util/util';

export default {
  storage: multer.diskStorage({
    destination: getPath('usuario'),
    filename: (request, file, cb) => {
      const userId: string | undefined = request.headers.authorization;
      const originalName: string = file.originalname;
      const extensao: string | undefined = originalName.split('.').pop();
      const buffer = encryptMidia(userId);
      const fileName: string = `${ buffer }.${ extensao }`;

      cb(null, fileName);
    }
  })
}