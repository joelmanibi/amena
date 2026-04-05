const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const env = require('./config/env');
const apiRoutes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middleware/error.middleware');

require('./models');


const app = express();

app.set('trust proxy', true);
app.use(helmet());
app.use(cors({ origin: env.corsOrigin, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/uploads', (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});
app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

app.get('/health', (req, res) => {
  res.status(200).json({ message: 'AMENA CONSULTING API is running.' });
});

app.use('/api', apiRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
