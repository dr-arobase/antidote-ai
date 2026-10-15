const express = require('express');
const router = express.Router();
const {
  saveText,
  getHistory,
  getHistoryItem,
  deleteHistoryItem,
} = require('../controllers/historyController');
const { protect } = require('../middleware/auth');

// Toutes les routes d'historique nécessitent une authentification
router.use(protect);

router.post('/',     saveText);
router.get('/',      getHistory);
router.get('/:id',   getHistoryItem);
router.delete('/:id', deleteHistoryItem);

module.exports = router;
