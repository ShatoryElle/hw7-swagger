import path from 'path';
import fs from 'fs/promises';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from '../constants/index.js';

const saveFileToUploadDir = async (file) => {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });

  const srcPath = path.join(TEMP_UPLOAD_DIR, file.filename);
  const destPath = path.join(UPLOAD_DIR, file.filename);

  await fs.rename(srcPath, destPath);

  return destPath;
};

export default saveFileToUploadDir;