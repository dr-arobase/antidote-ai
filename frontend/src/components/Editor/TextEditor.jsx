import React from 'react';
import HighlightedText from './HighlightedText';

const LANGUAGES = [
  { value: 'auto',  label: '🌐 Auto-détection' },
  { value: 'fr',    label: '🇫🇷 Français' },
  { value: 'en-US', label: '🇺🇸 English (US)' },
  { value: 'en-GB', label: '🇬🇧 English (UK)' },
  { value: 'es',    label: '🇪🇸 Español' },
  { value: 'de',    label: '🇩🇪 Deutsch' },
];

const LANG_NAMES = {
  fr:     'Français',
  'en-US': 'English (US)',
  'en-GB': 'English (UK)',
  en:     'English',
  es:     'Español',
  de:     'Deutsch',
};

const TextEditor = ({
  text,
  errors,
  isAnalyzing,
  activeError,
  language,
  autoAnalyze,
  detectedLanguage,
  apiError,
  onTextChange,
  onAnalyze,
  onClear,
  onErrorClick,
  onLanguageChange,
  onAutoAnalyzeChange,
}) => {
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;
  const errorCount = errors.length;

  return (
    <div className="text-editor">
      {/* ── Barre de contrôles ── */}
      <div className="te-controls">
        <select
          className="te-select"
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
          aria-label="Sélectionner la langue"
        >
          {LANGUAGES.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>

        {detectedLanguage && detectedLanguage !== 'auto' && (
          <span className="te-detected">
            Détecté : {LANG_NAMES[detectedLanguage] || detectedLanguage}
          </span>
        )}

        <label className="te-toggle">
          <input
            type="checkbox"
            checked={autoAnalyze}
            onChange={(e) => onAutoAnalyzeChange(e.target.checked)}
          />
          <span className="te-toggle__label">Analyse auto</span>
        </label>
      </div>

      {/* ── Zone de saisie ── */}
      <textarea
        className="te-textarea"
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder="Entrez votre texte ici pour le corriger… (français ou anglais)"
        spellCheck={false}
        aria-label="Texte à corriger"
      />

      {/* ── Barre d'actions ── */}
      <div className="te-actions">
        <div className="te-stats">
          <span>{wordCount} mot{wordCount !== 1 ? 's' : ''}</span>
          <span className="te-stats__sep">·</span>
          <span>{charCount} car.</span>
          {errorCount > 0 && (
            <>
              <span className="te-stats__sep">·</span>
              <span className="te-stats__errors">
                {errorCount} erreur{errorCount > 1 ? 's' : ''}
              </span>
            </>
          )}
        </div>

        <div className="te-btns">
          {text && (
            <button className="btn btn--ghost btn--sm" onClick={onClear}>
              Effacer
            </button>
          )}
          <button
            className="btn btn--primary"
            onClick={() => onAnalyze()}
            disabled={isAnalyzing || !text.trim()}
          >
            {isAnalyzing ? (
              <>
                <span className="spinner" style={{ width: 16, height: 16 }} />
                Analyse…
              </>
            ) : (
              '✦ Corriger'
            )}
          </button>
        </div>
      </div>

      {/* ── Erreur API ── */}
      {apiError && (
        <div className="alert alert--error" style={{ marginTop: '0.75rem' }}>
          {apiError}
        </div>
      )}

      {/* ── Aperçu avec corrections ── */}
      {errors.length > 0 && (
        <div className="te-preview">
          <div className="te-preview__header">
            <span>Aperçu avec corrections</span>
            <span className="te-preview__hint">
              Cliquez sur un mot souligné pour voir les suggestions
            </span>
          </div>
          <div className="te-preview__body">
            <HighlightedText
              text={text}
              errors={errors}
              activeError={activeError}
              onErrorClick={onErrorClick}
            />
          </div>
        </div>
      )}

      <style>{`
        .text-editor {
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
        }
        .te-controls {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .te-select {
          padding: 0.375rem 0.625rem;
          border: 1.5px solid var(--border);
          border-radius: var(--radius);
          background: var(--bg-primary);
          color: var(--text-primary);
          font-size: 0.875rem;
          cursor: pointer;
          outline: none;
          transition: border-color var(--transition);
        }
        .te-select:focus { border-color: var(--border-focus); }
        .te-detected {
          font-size: 0.8125rem;
          color: var(--text-muted);
          background: var(--bg-surface);
          padding: 0.25rem 0.625rem;
          border-radius: 999px;
        }
        .te-toggle {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          cursor: pointer;
          user-select: none;
        }
        .te-toggle input[type="checkbox"] {
          width: 1rem;
          height: 1rem;
          accent-color: var(--primary);
          cursor: pointer;
        }
        .te-toggle__label { font-size: 0.875rem; color: var(--text-secondary); }
        .te-textarea {
          width: 100%;
          min-height: 240px;
          padding: 1rem;
          border: 1.5px solid var(--border);
          border-radius: var(--radius-lg);
          background: var(--bg-primary);
          color: var(--text-primary);
          font-family: inherit;
          font-size: 0.9375rem;
          line-height: 1.7;
          resize: vertical;
          outline: none;
          transition: border-color var(--transition), box-shadow var(--transition);
        }
        .te-textarea:focus {
          border-color: var(--border-focus);
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.12);
        }
        .te-textarea::placeholder { color: var(--text-muted); }
        .te-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .te-stats {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.8125rem;
          color: var(--text-muted);
        }
        .te-stats__sep { color: var(--border); }
        .te-stats__errors { color: var(--danger); font-weight: 600; }
        .te-btns { display: flex; gap: 0.5rem; }
        .te-preview {
          border: 1.5px solid var(--border);
          border-radius: var(--radius-lg);
          background: var(--bg-primary);
          overflow: hidden;
        }
        .te-preview__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.625rem 1rem;
          border-bottom: 1px solid var(--border);
          background: var(--bg-surface);
        }
        .te-preview__header > span:first-child {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .te-preview__hint {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .te-preview__body { padding: 1rem; }
      `}</style>
    </div>
  );
};

export default TextEditor;
