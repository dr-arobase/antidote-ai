const axios = require('axios');

const LANGUAGE_TOOL_URL =
  process.env.LANGUAGE_TOOL_URL ||
  'https://api.languagetool.org/v2/check';

/**
 * Convertit le type d'erreur LanguageTool vers nos catégories internes.
 */
const mapIssueType = (issueType, categoryId = '') => {
  if (issueType === 'misspelling' || categoryId === 'TYPOS') return 'spelling';
  if (issueType === 'grammar'     || categoryId === 'GRAMMAR') return 'grammar';
  if (issueType === 'style'       || categoryId === 'STYLE') return 'style';
  if (issueType === 'typographical'|| categoryId === 'PUNCTUATION') return 'punctuation';
  return 'other';
};

/**
 * Envoie le texte à l'API LanguageTool et retourne les erreurs normalisées.
 * @param {string} text      - Texte à analyser
 * @param {string} language  - Code langue ('auto', 'fr', 'en-US', …)
 * @returns {{ errors, detectedLanguage, errorCount }}
 */
const analyzeText = async (text, language = 'auto') => {
  const params = new URLSearchParams({ text, language, enabledOnly: 'false' });

  try {
    const response = await axios.post(LANGUAGE_TOOL_URL, params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      timeout: 30000,
    });

    const { matches, language: langInfo } = response.data;
    const detectedLanguage =
      langInfo?.detectedLanguage?.code || language;

    const errors = matches.map((match) => ({
      offset:       match.offset,
      length:       match.length,
      message:      match.message,
      shortMessage: match.shortMessage || match.message,
      type: mapIssueType(
        match.rule?.issueType,
        match.rule?.category?.id
      ),
      suggestions: (match.replacements || [])
        .slice(0, 5)
        .map((r) => r.value),
      context:  match.context,
      ruleId:   match.rule?.id,
    }));

    return { errors, detectedLanguage, errorCount: errors.length };
  } catch (err) {
    if (err.response) {
      const status = err.response.status;
      const body   = err.response.data;
      console.error('LanguageTool error body:', JSON.stringify(body));
      if (status === 429 || (status === 400 && !body?.message)) {
        throw new Error('Trop de requêtes envoyées. Veuillez patienter quelques secondes avant de réessayer.');
      }
      throw new Error(
        `Erreur API LanguageTool (${status}): ${body?.message || 'inconnue'}`
      );
    }
    if (err.code === 'ECONNABORTED') {
      throw new Error("L'API de correction a mis trop de temps à répondre.");
    }
    throw new Error(`Impossible de contacter l'API de correction : ${err.message}`);
  }
};

module.exports = { analyzeText };
