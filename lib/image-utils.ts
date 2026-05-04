import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

const UPLOAD_DIR = process.env.UPLOAD_DIR || './public/uploads';

export async function processAndSaveImage(
  buffer: Buffer,
  productId: string,
  originalFilename: string
): Promise<string> {
  const productDir = path.join(UPLOAD_DIR, 'products', productId);
  await fs.mkdir(productDir, { recursive: true });
  const filename = `${Date.now()}-${originalFilename.replace(/[^a-zA-Z0-9.-]/g, '')}`;
  const finalFilename = `${path.parse(filename).name}.webp`;
  const filePath = path.join(productDir, finalFilename);

  await sharp(buffer)
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(filePath);

  return `/uploads/products/${productId}/${finalFilename}`;
}

export async function deleteLocalImage(localPath: string): Promise<boolean> {
  try {
    const safePath = path.normalize(localPath).replace(/^(\.\.(\/|\\|$))+/, '');
    const absolutePath = path.join(process.cwd(), 'public', safePath);
    if (!absolutePath.startsWith(path.join(process.cwd(), 'public', 'uploads'))) {
      return false;
    }
    await fs.unlink(absolutePath);
    return true;
  } catch (error) {
    return false;
  }
}
