import multer, { Multer } from 'multer';
import path from 'path';

const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../public'));
   },
   filename: (req, file, cb) => {;
      cb(null, file.originalname);
   }
});

const upload: Multer = multer({ storage });
export default upload;