const app = require('./app');
const env = require('./config/env');
const { sequelize } = require('./models');
const { connectDatabase } = require('./config/database');

async function startServer() {
  try {
    await connectDatabase();

    if (env.dbSync) {
      await sequelize.sync();
      console.log('Database synchronized successfully.');
    }

    app.listen(env.port, () => {
      console.log(`Server listening on port ${env.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();