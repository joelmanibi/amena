const path = require('path');
const env = require('../config/env');

function getBackendPublicBaseUrl() {
  return (env.backendPublicUrl || `http://localhost:${env.port}`).replace(/\/$/, '');
}

function resolvePublicAssetUrl(assetPath) {
  if (!assetPath) {
    return assetPath;
  }

  if (/^https?:\/\//i.test(assetPath)) {
    return assetPath;
  }

  const normalizedPath = assetPath.startsWith('/') ? assetPath : `/${assetPath}`;
  return `${getBackendPublicBaseUrl()}${normalizedPath}`;
}

function getUploadDirectory(scope) {
  return path.join(process.cwd(), 'public', 'uploads', scope);
}

module.exports = {
  getBackendPublicBaseUrl,
  getUploadDirectory,
  resolvePublicAssetUrl,
};