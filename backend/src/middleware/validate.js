const { body } = require('express-validator');

// ── Inscription ───────────────────────────────────────────────────────────────
const validateRegister = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Le nom est requis.')
    .isLength({ min: 2, max: 50 })
    .withMessage('Le nom doit avoir entre 2 et 50 caractères.'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage("L'email est requis.")
    .isEmail()
    .withMessage("L'email n'est pas valide.")
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Le mot de passe est requis.')
    .isLength({ min: 8 })
    .withMessage('Le mot de passe doit avoir au moins 8 caractères.')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre.'
    ),
];

// ── Connexion ─────────────────────────────────────────────────────────────────
const validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage("L'email est requis.")
    .isEmail()
    .withMessage("L'email n'est pas valide."),

  body('password').notEmpty().withMessage('Le mot de passe est requis.'),
];

// ── Analyse de texte ──────────────────────────────────────────────────────────
const validateAnalysis = [
  body('text')
    .notEmpty()
    .withMessage('Le texte est requis.')
    .isLength({ max: 20000 })
    .withMessage('Le texte ne peut pas dépasser 20 000 caractères.'),

  body('language')
    .optional()
    .isIn(['auto', 'fr', 'en-US', 'en-GB', 'es', 'de', 'it', 'pt'])
    .withMessage('Langue non supportée.'),
];

module.exports = { validateRegister, validateLogin, validateAnalysis };
