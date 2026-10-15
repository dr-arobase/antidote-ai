require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(
        `🚀 Serveur démarré sur le port ${PORT} [${process.env.NODE_ENV || 'development'}]`
      );
    });
  } catch (err) {
    console.error('❌ Impossible de démarrer le serveur:', err.message);
    process.exit(1);
  }
};

startServer();
