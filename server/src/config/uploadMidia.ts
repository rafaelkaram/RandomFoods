import fs from 'fs';
import multer from 'multer';
import Util from '../util/Util';

export default {
  storage: multer.diskStorage({
    destination: (request, file, cb) => {
      const { idReceita } = request.body as { idReceita: string | undefined};
      const buffer: string = Util.encryptMidia(idReceita);
      const midiaPath: string = Util.getPath('midia', buffer);
      if (!fs.existsSync(midiaPath)) {
        fs.mkdirSync(midiaPath);
      }

      cb(null, midiaPath);
    },
    filename: (request, file, cb) => {
      const { idReceita } = request.body as { idReceita: string | undefined};
      const originalName: string = file.originalname;
      const extensao: string | undefined = originalName.split('.').pop();
      const buffer: string = Util.encryptMidia(idReceita);
      const fileName: string = `${ Date.now() }-${ buffer }.${ extensao }`;

      cb(null, fileName);
    }
  })
}