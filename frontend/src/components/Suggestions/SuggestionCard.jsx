import React from 'react';

const TYPE_INFO = {
  spelling:    { label: 'Orthographe', color: 'var(--err-spelling)',    bg: 'var(--danger-light)'  },
  grammar:     { label: 'Grammaire',   color: 'var(--err-grammar)',     bg: 'var(--warning-light)' },
  style:       { label: 'Style',       color: 'var(--err-style)',       bg: 'var(--purple-light)'  },
  punctuation: { label: 'Ponctuation', color: 'var(--err-punctuation)', bg: 'var(--info-light)'    },
  other:       { label: 'Autre',       color: 'var(--err-other)',       bg: 'var(--bg-surface)'    },
};

const SuggestionCard = ({ error, isActive, onClick, onApply }) => {
  const info = TYPE_INFO[error.type] || TYPE_INFO.other;

  // Extrait le mot erroné depuis le contexte ou depuis la chaîne d'erreur
  const wrongWord =
    error.context && error.context.text
      ? error.context.text.slice(
          error.context.offset,
          error.context.offset + error.context.length
        )
      : null;

  return (
    <div
      className={`sc-card${isActive ? ' sc-card--active' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      style={{ borderLeftColor: isActive ? info.color : 'transparent' }}
    >
      {/* En-tête */}
      <div className="sc-card__header">
        <span
          className="sc-card__badge"
          style={{ background: info.bg, color: info.color }}
        >
          {info.label}
        </span>
        {wrongWord && (
          <span className="sc-card__word">« {wrongWord} »</span>
        )}
      </div>

      {/* Message */}
      <p className="sc-card__message">{error.shortMessage || error.message}</p>

      {/* Suggestions (visibles uniquement si la carte est active) */}
      {isActive && error.suggestions.length > 0 && (
        <div className="sc-card__suggestions">
          <span className="sc-card__suggestions-label">Remplacer par :</span>
          <div className="sc-card__suggestions-list">
            {error.suggestions.map((s, i) => (
              <button
                key={i}
                className="sc-card__suggestion-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onApply(s);
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {isActive && error.suggestions.length === 0 && (
        <p className="sc-card__no-suggestion">Aucune suggestion disponible.</p>
      )}
    </div>
  );
};

export default SuggestionCard;
