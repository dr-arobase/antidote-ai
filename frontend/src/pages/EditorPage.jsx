import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextEditor from '../components/Editor/TextEditor';
import SuggestionPanel from '../components/Suggestions/SuggestionPanel';
import { useAnalysis } from '../hooks/useAnalysis';
import { useAuth } from '../context/AuthContext';
import { historyAPI } from '../services/api';

const EditorPage = () => {
  const {
    text,
    language,
    errors,
    isAnalyzing,
    activeError,
    autoAnalyze,
    detectedLanguage,
    apiError,
    setLanguage,
    setActiveError,
    setAutoAnalyze,
    handleTextChange,
    analyze,
    applyCorrection,
    clearText,
  } = useAnalysis();

  const { user } = useAuth();
  const navigate  = useNavigate();

  // Restauration depuis la page Historique
  React.useEffect(() => {
    const raw = sessionStorage.getItem('restoreText');
    if (raw) {
      try {
        const { text: t, language: l } = JSON.parse(raw);
        handleTextChange(t);
        setLanguage(l);
      } catch { /* ignore */ }
      sessionStorage.removeItem('restoreText');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [isSaving, setIsSaving]       = useState(false);
  const [saveMsg, setSaveMsg]         = useState('');

  const handleAnalyze = async () => {
    await analyze();
    setHasAnalyzed(true);
  };

  const handleSave = async () => {
    if (!user) { navigate('/login'); return; }
    setIsSaving(true);
    setSaveMsg('');
    try {
      await historyAPI.save({
        originalText: text,
        correctedText: text,
        errors,
        language,
        detectedLanguage,
      });
      setSaveMsg('✓ Texte sauvegardé dans l\'historique.');
      setTimeout(() => setSaveMsg(''), 4000);
    } catch {
      setSaveMsg('Erreur lors de la sauvegarde.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="editor-page">
      {/* ── Hero ── */}
      <div className="editor-page__hero">
        <h1 className="editor-page__hero-title">
          Correcteur de texte IA
        </h1>
        <p className="editor-page__hero-sub">
          Détectez et corrigez les fautes d'orthographe, de grammaire et de style
          en français et en anglais.
        </p>
      </div>

      {/* ── Grille principale ── */}
      <div className="editor-page__grid">
        {/* Colonne gauche — éditeur */}
        <div className="editor-page__left">
          <TextEditor
            text={text}
            errors={errors}
            isAnalyzing={isAnalyzing}
            activeError={activeError}
            language={language}
            autoAnalyze={autoAnalyze}
            detectedLanguage={detectedLanguage}
            apiError={apiError}
            onTextChange={handleTextChange}
            onAnalyze={handleAnalyze}
            onClear={clearText}
            onErrorClick={setActiveError}
            onLanguageChange={setLanguage}
            onAutoAnalyzeChange={setAutoAnalyze}
          />

          {/* Barre de sauvegarde */}
          {hasAnalyzed && (
            <div className="editor-page__save-bar">
              {user ? (
                <button
                  className="btn btn--ghost btn--sm"
                  onClick={handleSave}
                  disabled={isSaving || !text.trim()}
                >
                  {isSaving ? (
                    <><span className="spinner" style={{ width: 14, height: 14 }} /> Sauvegarde…</>
                  ) : (
                    '💾 Sauvegarder dans l\'historique'
                  )}
                </button>
              ) : (
                <span className="editor-page__save-hint">
                  <a href="/login">Connectez-vous</a> pour sauvegarder vos corrections.
                </span>
              )}
              {saveMsg && (
                <span
                  className={`editor-page__save-msg ${saveMsg.startsWith('✓') ? 'editor-page__save-msg--ok' : 'editor-page__save-msg--err'}`}
                >
                  {saveMsg}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Colonne droite — suggestions */}
        <div className="editor-page__right">
          <SuggestionPanel
            errors={errors}
            activeError={activeError}
            onErrorClick={setActiveError}
            onApply={applyCorrection}
            isAnalyzing={isAnalyzing}
            hasAnalyzed={hasAnalyzed}
          />
        </div>
      </div>

      <style>{`
        .editor-page {
          max-width: 1280px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
        }
        .editor-page__hero {
          text-align: center;
          margin-bottom: 2rem;
        }
        .editor-page__hero-title {
          font-size: clamp(1.5rem, 3vw, 2.25rem);
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.02em;
          margin-bottom: 0.5rem;
        }
        .editor-page__hero-sub {
          font-size: 1rem;
          color: var(--text-muted);
          max-width: 560px;
          margin: 0 auto;
        }
        .editor-page__grid {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 1.5rem;
          align-items: start;
        }
        @media (max-width: 900px) {
          .editor-page__grid {
            grid-template-columns: 1fr;
          }
          .editor-page__right {
            order: -1;
          }
        }
        .editor-page__left {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .editor-page__right {
          position: sticky;
          top: calc(3.75rem + 1rem);
          max-height: calc(100vh - 3.75rem - 2rem);
          overflow: hidden;
        }
        .editor-page__save-bar {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .editor-page__save-hint {
          font-size: 0.8125rem;
          color: var(--text-muted);
        }
        .editor-page__save-msg {
          font-size: 0.8125rem;
          font-weight: 600;
        }
        .editor-page__save-msg--ok  { color: var(--primary); }
        .editor-page__save-msg--err { color: var(--danger); }
      `}</style>
    </div>
  );
};

export default EditorPage;
