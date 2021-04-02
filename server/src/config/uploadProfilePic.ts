import multer from 'multer';
import Util from '../util/Util';

export default {
  storage: multer.diskStorage({
    destination: Util.getPath('usuario'),
    filename: (request, file, cb) => {
      const userId: string | undefined = request.headers.authorization;
      const originalName: string = file.originalname;
      const extensao: string | undefined = originalName.split('.').pop();
      const buffer = Util.encryptMidia(userId);
      const fileName: string = `${ buffer }.${ extensao }`;

      cb(null, fileName);
    }
  })
}