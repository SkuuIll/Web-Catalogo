import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';

const UPLOAD_DIR = process.env.UPLOAD_DIR || './public/uploads';
const ALLOWED_IMAGE_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']);

function safeUploadRoot() {
  return path.resolve(process.cwd(), UPLOAD_DIR);
}

function safeSegment(value: string) {
  return value.replace(/[^a-zA-Z0-9-_]/g, '-').replace(/-+/g, '-').replace(/(^-|-$)/g, '') || 'general';
}

export function getMaxImageUploadBytes() {
  return Math.max(1, parseInt(process.env.MAX_FILE_SIZE_MB || '10', 10)) * 1024 * 1024;
}

export function validateImageFile(file: File) {
  const maxSize = getMaxImageUploadBytes();
  if (file.size <= 0) {
    return 'El archivo está vacío';
  }
  if (file.size > maxSize) {
    return `Archivo muy grande. Máximo ${Math.round(maxSize / 1024 / 1024)}MB`;
  }
  if (!ALLOWED_IMAGE_MIME_TYPES.has(file.type)) {
    return 'Formato no permitido. Usá JPG, PNG, WebP, GIF o AVIF.';
  }
  return null;
}

export async function processAndSaveUploadedImage(
  buffer: Buffer,
  folder: string,
  originalFilename: string
): Promise<string> {
  const metadata = await sharp(buffer, { failOn: 'error' }).metadata();
  if (!metadata.width || !metadata.height) {
    throw new Error('El archivo no parece ser una imagen válida');
  }

  const uploadRoot = safeUploadRoot();
  const targetDir = path.resolve(uploadRoot, safeSegment(folder));
  if (!targetDir.startsWith(uploadRoot)) {
    throw new Error('Destino de imagen inválido');
  }

  await fs.mkdir(targetDir, { recursive: true });
  const baseName = path.parse(originalFilename).name.replace(/[^a-zA-Z0-9-_]/g, '-').slice(0, 60) || 'imagen';
  const finalFilename = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}-${baseName}.webp`;
  const filePath = path.join(targetDir, finalFilename);

  await sharp(buffer)
    .rotate()
    .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(filePath);

  const publicPath = path.relative(path.join(process.cwd(), 'public'), filePath).replace(/\\/g, '/');
  return `/${publicPath}`;
}

export async function processAndSaveImage(
  buffer: Buffer,
  productId: string,
  originalFilename: string
): Promise<string> {
  return processAndSaveUploadedImage(buffer, `products/${productId}`, originalFilename);
}

export async function deleteLocalImage(localPath: string): Promise<boolean> {
  try {
    const cleanedPath = localPath.replace(/^\/+/, '');
    const absolutePath = path.resolve(process.cwd(), 'public', cleanedPath);
    if (!absolutePath.startsWith(safeUploadRoot())) {
      return false;
    }
    await fs.unlink(absolutePath);
    return true;
  } catch (error) {
    return false;
  }
}
