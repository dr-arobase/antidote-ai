import React from 'react';
import SuggestionCard from './SuggestionCard';

const EmptyState = () => (
  <div className="sp-empty">
    <div className="sp-empty__icon">✦</div>
    <p className="sp-empty__title">Prêt à corriger</p>
    <p className="sp-empty__desc">
      Saisissez votre texte et cliquez sur <strong>Corriger</strong> pour
      détecter les erreurs d'orthographe, de grammaire et de style.
    </p>
  </div>
);

const NoErrors = () => (
  <div className="sp-empty">
    <div className="sp-empty__icon sp-empty__icon--success">✓</div>
    <p className="sp-empty__title">Aucune erreur détectée</p>
    <p className="sp-empty__desc">Votre texte semble correct !</p>
  </div>
);

const TYPE_ORDER = ['spelling', 'grammar', 'punctuation', 'style', 'other'];
const TYPE_LABELS = {
  spelling:    'Orthographe',
  grammar:     'Grammaire',
  punctuation: 'Ponctuation',
  style:       'Style',
  other:       'Autre',
};

const SuggestionPanel = ({
  errors,
  activeError,
  onErrorClick,
  onApply,
  isAnalyzing,
  hasAnalyzed,
}) => {
  // Statistiques par type
  const counts = errors.reduce((acc, e) => {
    acc[e.type] = (acc[e.type] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="suggestion-panel">
      {/* ── En-tête ── */}
      <div className="sp-header">
        <h2 className="sp-header__title">Corrections</h2>
        {errors.length > 0 && (
          <span className="sp-header__count">
            {errors.length} erreur{errors.length > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* ── Résumé par type ── */}
      {errors.length > 0 && (
        <div className="sp-summary">
          {TYPE_ORDER.filter((t) => counts[t]).map((t) => (
            <span key={t} className={`badge badge--${t}`}>
              {counts[t]} {TYPE_LABELS[t]}
            </span>
          ))}
        </div>
      )}

      {/* ── Corps ── */}
      <div className="sp-body">
        {isAnalyzing ? (
          <div className="sp-loading">
            <div className="spinner" />
            <span>Analyse en cours…</span>
          </div>
        ) : !hasAnalyzed ? (
          <EmptyState />
        ) : errors.length === 0 ? (
          <NoErrors />
        ) : (
          <div className="sp-list">
            {errors.map((error, i) => (
              <SuggestionCard
                key={i}
                error={error}
                isActive={activeError === error}
                onClick={() =>
                  onErrorClick(activeError === error ? null : error)
                }
                onApply={(s) => onApply(error, s)}
              />
            ))}
          </div>
        )}
      </div>

      <style>{`
        .suggestion-panel {
          display: flex;
          flex-direction: column;
          background: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          height: 100%;
        }
        .sp-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem 0.75rem;
          border-bottom: 1px solid var(--border);
        }
        .sp-header__title {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .sp-header__count {
          font-size: 0.8125rem;
          font-weight: 600;
          background: var(--danger-light);
          color: var(--danger);
          padding: 0.125rem 0.5rem;
          border-radius: 999px;
        }
        .sp-summary {
          display: flex;
          flex-wrap: wrap;
          gap: 0.375rem;
          padding: 0.75rem 1.25rem;
          border-bottom: 1px solid var(--border);
          background: var(--bg-secondary);
        }
        .sp-body {
          flex: 1;
          overflow-y: auto;
        }
        .sp-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          padding: 3rem 1.25rem;
          color: var(--text-muted);
          font-size: 0.9rem;
        }
        .sp-list {
          padding: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .sp-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 3rem 1.5rem;
          gap: 0.75rem;
        }
        .sp-empty__icon {
          font-size: 2.5rem;
          color: var(--text-muted);
          line-height: 1;
        }
        .sp-empty__icon--success { color: var(--primary); }
        .sp-empty__title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .sp-empty__desc {
          font-size: 0.875rem;
          color: var(--text-muted);
          line-height: 1.5;
          max-width: 220px;
        }
        /* ── SuggestionCard ── */
        .sc-card {
          padding: 0.75rem 0.875rem;
          border: 1px solid var(--border);
          border-left: 3px solid transparent;
          border-radius: var(--radius);
          background: var(--bg-primary);
          cursor: pointer;
          transition: all var(--transition);
          outline: none;
        }
        .sc-card:hover { background: var(--bg-secondary); }
        .sc-card--active {
          background: var(--bg-secondary);
          box-shadow: var(--shadow-sm);
        }
        .sc-card__header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.375rem;
          flex-wrap: wrap;
        }
        .sc-card__badge {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 0.1rem 0.4rem;
          border-radius: 4px;
        }
        .sc-card__word {
          font-size: 0.8125rem;
          color: var(--text-muted);
          font-style: italic;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 160px;
        }
        .sc-card__message {
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }
        .sc-card__suggestions {
          margin-top: 0.625rem;
          padding-top: 0.625rem;
          border-top: 1px solid var(--border);
        }
        .sc-card__suggestions-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          display: block;
          margin-bottom: 0.375rem;
        }
        .sc-card__suggestions-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.375rem;
        }
        .sc-card__suggestion-btn {
          padding: 0.25rem 0.75rem;
          border: 1.5px solid var(--primary);
          border-radius: var(--radius);
          background: var(--primary-light);
          color: var(--primary-dark);
          font-size: 0.875rem;
          font-weight: 600;
          transition: all var(--transition);
        }
        .sc-card__suggestion-btn:hover {
          background: var(--primary);
          color: #fff;
        }
        .sc-card__no-suggestion {
          margin-top: 0.5rem;
          font-size: 0.8125rem;
          color: var(--text-muted);
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

export default SuggestionPanel;
