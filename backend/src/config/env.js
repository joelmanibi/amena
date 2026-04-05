const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

module.exports = {
  port: Number(process.env.PORT || 5000),
  nodeEnv: process.env.NODE_ENV || 'development',
  dbHost: process.env.DB_HOST || '127.0.0.1',
  dbPort: Number(process.env.DB_PORT || 3306),
  dbName: process.env.DB_NAME || 'amena_consulting',
  dbUser: process.env.DB_USER || 'root',
  dbPassword: process.env.DB_PASSWORD || '',
  dbSync: true,
  jwtSecret: process.env.JWT_SECRET || 'change-this-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  backendPublicUrl: (process.env.BACKEND_PUBLIC_URL || process.env.API_PUBLIC_BASE_URL || process.env.PUBLIC_API_BASE_URL || process.env.API_BASE_URL || `http://localhost:${Number(process.env.PORT || 5000)}`)
    .replace(/\/$/, '')
    .replace(/\/api$/, ''),

};
