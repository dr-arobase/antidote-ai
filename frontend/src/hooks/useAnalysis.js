import { useState, useCallback, useRef } from 'react';
import { analysisAPI } from '../services/api';

const DEBOUNCE_MS = 3000;

/**
 * Hook central qui gère l'état du texte, les erreurs et les corrections.
 */
export const useAnalysis = () => {
  const [text, setText]                     = useState('');
  const [language, setLanguage]             = useState('auto');
  const [errors, setErrors]                 = useState([]);
  const [isAnalyzing, setIsAnalyzing]       = useState(false);
  const [activeError, setActiveError]       = useState(null);
  const [autoAnalyze, setAutoAnalyze]       = useState(false);
  const [detectedLanguage, setDetectedLang] = useState(null);
  const [apiError, setApiError]             = useState(null);

  const debounceRef = useRef(null);

  /** Lance l'analyse via l'API backend. */
  const analyze = useCallback(
    async (textToAnalyze, lang) => {
      const t = textToAnalyze !== undefined ? textToAnalyze : text;
      const l = lang !== undefined ? lang : language;

      if (!t.trim()) {
        setErrors([]);
        setDetectedLang(null);
        return;
      }

      setIsAnalyzing(true);
      setApiError(null);

      try {
        const res = await analysisAPI.analyze(t, l);
        const { errors: newErrors, detectedLanguage: detected } = res.data.data;
        setErrors(newErrors);
        setDetectedLang(detected);
        setActiveError(null);
      } catch (err) {
        const msg =
          err.response?.data?.error ||
          "Impossible de joindre l'API de correction.";
        setApiError(msg);
      } finally {
        setIsAnalyzing(false);
      }
    },
    [text, language]
  );

  /** Met à jour le texte, déclenche l'analyse automatique si activée. */
  const handleTextChange = useCallback(
    (newText) => {
      setText(newText);

      if (autoAnalyze) {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
          analyze(newText, language);
        }, DEBOUNCE_MS);
      }
    },
    [autoAnalyze, analyze, language]
  );

  /**
   * Applique une suggestion de correction au texte.
   * Recalcule les offsets des erreurs restantes.
   */
  const applyCorrection = useCallback(
    (error, suggestion) => {
      const before  = text.slice(0, error.offset);
      const after   = text.slice(error.offset + error.length);
      const newText = before + suggestion + after;

      const diff = suggestion.length - error.length;

      const updatedErrors = errors
        .filter((e) => e !== error)
        .map((e) =>
          e.offset > error.offset ? { ...e, offset: e.offset + diff } : e
        );

      setText(newText);
      setErrors(updatedErrors);
      setActiveError(null);
    },
    [text, errors]
  );

  /** Efface tout. */
  const clearText = useCallback(() => {
    setText('');
    setErrors([]);
    setActiveError(null);
    setDetectedLang(null);
    setApiError(null);
  }, []);

  return {
    text,
    language,
    errors,
    isAnalyzing,
    activeError,
    autoAnalyze,
    detectedLanguage,
    apiError,
    setText,
    setLanguage,
    setActiveError,
    setAutoAnalyze,
    handleTextChange,
    analyze,
    applyCorrection,
    clearText,
  };
};
