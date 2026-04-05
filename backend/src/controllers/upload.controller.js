const { randomUUID } = require('crypto');
const path = require('path');
const { mkdir, writeFile } = require('fs/promises');
const asyncHandler = require('../utils/asyncHandler');
const { getUploadDirectory, resolvePublicAssetUrl } = require('../utils/media');

const IMAGE_MIME_TYPES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const uploadImage = asyncHandler(async (req, res) => {
  const scope = req.body.scope;
  const mimeType = req.body.mimeType;
  const contentBase64 = String(req.body.contentBase64 || '').replace(/^data:[^;]+;base64,/, '').trim();
  const extension = IMAGE_MIME_TYPES[mimeType];

  if (!extension || !contentBase64) {
    return res.status(400).json({ message: 'Invalid image upload payload.' });
  }

  const fileBuffer = Buffer.from(contentBase64, 'base64');

  if (!fileBuffer.length || fileBuffer.length > MAX_IMAGE_SIZE) {
    return res.status(400).json({ message: 'Image must be smaller than 5 MB.' });
  }

  const uploadDirectory = getUploadDirectory(scope);
  await mkdir(uploadDirectory, { recursive: true });

  const fileName = `${Date.now()}-${randomUUID()}.${extension}`;
  const filePath = path.join(uploadDirectory, fileName);
  const relativePath = `/uploads/${scope}/${fileName}`;

  await writeFile(filePath, fileBuffer);

  res.status(201).json({
    message: 'Image uploaded successfully.',
    data: {
      path: relativePath,
      url: resolvePublicAssetUrl(relativePath),
    },
  });
});

module.exports = {
  uploadImage,
};