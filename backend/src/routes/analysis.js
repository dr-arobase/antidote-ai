const express = require('express');
const router = express.Router();
const { analyze } = require('../controllers/analysisController');
const { optionalAuth } = require('../middleware/auth');
const { validateAnalysis } = require('../middleware/validate');

// L'analyse est accessible sans compte, mais on reconnaît les utilisateurs connectés
router.post('/analyze', optionalAuth, validateAnalysis, analyze);

module.exports = router;
