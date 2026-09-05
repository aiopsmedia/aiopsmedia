import { db } from '@/lib/db';

const CLOUDINARY_CLOUD = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_SECRET = process.env.CLOUDINARY_API_SECRET;

const isCloudinary = !!(CLOUDINARY_CLOUD && CLOUDINARY_KEY && CLOUDINARY_SECRET);

async function signCloudinaryUpload(paramsToSign) {
  const crypto = await import('crypto');
  const sorted = Object.keys(paramsToSign)
    .sort()
    .map((key) => `${key}=${paramsToSign[key]}`)
    .join('&');
  return crypto.createHash('sha1').update(sorted + CLOUDINARY_SECRET).digest('hex');
}

export async function uploadFile(file, folder = 'uploads') {
  if (isCloudinary) {
    return uploadToCloudinary(file, folder);
  }
  return uploadToLocal(file, folder);
}

async function uploadToCloudinary(file, folder) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const timestamp = Math.floor(Date.now() / 1000);
  const paramsToSign = { folder, timestamp };
  const signature = await signCloudinaryUpload(paramsToSign);

  const formData = new FormData();
  formData.append('file', buffer, file.name || 'upload');
  formData.append('api_key', CLOUDINARY_KEY);
  formData.append('timestamp', timestamp);
  formData.append('folder', folder);
  formData.append('signature', signature);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/auto/upload`,
    { method: 'POST', body: formData }
  );

  if (!res.ok) throw new Error('Cloudinary upload failed');

  const data = await res.json();
  return {
    url: data.secure_url,
    publicId: data.public_id,
    width: data.width,
    height: data.height,
    format: data.format,
  };
}

async function uploadToLocal(file, folder) {
  const { writeFile, mkdir } = await import('fs/promises');
  const { join } = await import('path');
  const { randomId } = await import('@/lib/utils');

  const uploadsDir = join(process.cwd(), 'public', 'uploads', folder);
  await mkdir(uploadsDir, { recursive: true });

  const ext = file.name?.split('.').pop() || 'bin';
  const filename = `${randomId(12)}.${ext}`;
  const filePath = join(uploadsDir, filename);

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await writeFile(filePath, buffer);

  return {
    url: `/uploads/${folder}/${filename}`,
    publicId: null,
    width: null,
    height: null,
    format: ext,
  };
}

export async function deleteFile(publicId) {
  if (!publicId) return;

  if (isCloudinary) {
    const timestamp = Math.floor(Date.now() / 1000);
    const crypto = await import('crypto');
    const signature = crypto
      .createHash('sha1')
      .update(`public_id=${publicId}&timestamp=${timestamp}${CLOUDINARY_SECRET}`)
      .digest('hex');

    await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/destroy`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_id: publicId, timestamp, api_key: CLOUDINARY_KEY, signature }),
      }
    );
    return;
  }

  try {
    const { unlink } = await import('fs/promises');
    const { join } = await import('path');
    const filePath = join(process.cwd(), 'public', publicId);
    await unlink(filePath);
  } catch {}
}
