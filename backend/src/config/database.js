const mongoose = require('mongoose');

/**
 * Établit la connexion à MongoDB.
 * Utilise MONGODB_URI depuis les variables d'environnement.
 */
const connectDB = async () => {
  const uri =
    process.env.MONGODB_URI || 'mongodb://localhost:27017/antidote';

  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB connecté : ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ Erreur de connexion MongoDB : ${err.message}`);
    throw err;
  }
};

module.exports = connectDB;
