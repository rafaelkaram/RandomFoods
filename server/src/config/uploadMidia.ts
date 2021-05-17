import fs from 'fs';
import multer from 'multer';
import util from '../util/util';

export default {
  storage: multer.diskStorage({
    destination: util.getPath('temp'),
    filename: (request, file, cb) => {
      const originalName: string = file.originalname;
      const extensao: string | undefined = originalName.split('.').pop();
      const fileName: string = `${ Date.now() }.${ extensao }`;

      cb(null, fileName);
    }
  })
}