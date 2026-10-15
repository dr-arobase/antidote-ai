const Text = require('../models/Text');

// ── POST /api/history ─────────────────────────────────────────────────────────
const saveText = async (req, res) => {
  const { originalText, correctedText, errors, language, detectedLanguage } =
    req.body;

  if (!originalText) {
    return res
      .status(400)
      .json({ success: false, error: 'Le texte original est requis.' });
  }

  try {
    const saved = await Text.create({
      userId: req.user._id,
      originalText,
      correctedText: correctedText || originalText,
      errors: errors || [],
      errorCount: errors?.length || 0,
      language: language || 'auto',
      detectedLanguage,
    });

    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    console.error('Erreur sauvegarde :', err);
    res.status(500).json({ success: false, error: 'Erreur serveur.' });
  }
};

// ── GET /api/history ──────────────────────────────────────────────────────────
const getHistory = async (req, res) => {
  try {
    const texts = await Text.find({ userId: req.user._id })
      .select('-errors') // On n'inclut pas le tableau d'erreurs dans la liste
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ success: true, data: texts });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Erreur serveur.' });
  }
};

// ── GET /api/history/:id ──────────────────────────────────────────────────────
const getHistoryItem = async (req, res) => {
  try {
    const text = await Text.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!text) {
      return res
        .status(404)
        .json({ success: false, error: 'Texte introuvable.' });
    }

    res.json({ success: true, data: text });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Erreur serveur.' });
  }
};

// ── DELETE /api/history/:id ───────────────────────────────────────────────────
const deleteHistoryItem = async (req, res) => {
  try {
    const text = await Text.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!text) {
      return res
        .status(404)
        .json({ success: false, error: 'Texte introuvable.' });
    }

    res.json({ success: true, message: 'Texte supprimé avec succès.' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Erreur serveur.' });
  }
};

module.exports = { saveText, getHistory, getHistoryItem, deleteHistoryItem };
