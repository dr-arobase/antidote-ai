const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware de protection : vérifie le token JWT.
 * Injecte req.user si le token est valide.
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res
      .status(401)
      .json({ success: false, error: 'Non autorisé. Token manquant.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, error: 'Utilisateur introuvable.' });
    }

    next();
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, error: 'Token invalide ou expiré.' });
  }
};

/**
 * Middleware d'authentification optionnel.
 * N'échoue pas si aucun token n'est fourni — utile pour les routes publiques
 * qui bénéficient de fonctionnalités supplémentaires si l'utilisateur est connecté.
 */
const optionalAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch {
      // Token invalide — on continue sans utilisateur
    }
  }

  next();
};

module.exports = { protect, optionalAuth };
