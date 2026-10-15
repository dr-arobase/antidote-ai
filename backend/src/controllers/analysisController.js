const { validationResult } = require('express-validator');
const { analyzeText } = require('../services/languageToolService');

// ── POST /api/analysis/analyze ────────────────────────────────────────────────
const analyze = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { text, language = 'auto' } = req.body;

  try {
    const result = await analyzeText(text, language);
    res.json({ success: true, data: result });
  } catch (err) {
    console.error('Erreur analyse :', err.message);
    res.status(502).json({
      success: false,
      error: err.message,
    });
  }
};

module.exports = { analyze };
