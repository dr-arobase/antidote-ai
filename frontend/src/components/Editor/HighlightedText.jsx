import React from 'react';

/**
 * Affiche le texte avec les erreurs mises en évidence.
 * Chaque erreur est cliquable pour afficher les suggestions.
 */

const ERROR_STYLES = {
  spelling:    { color: '#ef4444', label: 'Orthographe' },
  grammar:     { color: '#f97316', label: 'Grammaire' },
  style:       { color: '#a855f7', label: 'Style' },
  punctuation: { color: '#3b82f6', label: 'Ponctuation' },
  other:       { color: '#6b7280', label: 'Autre' },
};

/**
 * Découpe le texte en segments texte/erreur, filtre les chevauchements.
 */
const buildSegments = (text, errors) => {
  const sorted = [...errors].sort((a, b) => a.offset - b.offset);

  // Élimine les erreurs qui se chevauchent
  const clean = [];
  let lastEnd = 0;
  for (const err of sorted) {
    if (err.offset >= lastEnd) {
      clean.push(err);
      lastEnd = err.offset + err.length;
    }
  }

  const segments = [];
  let cursor = 0;

  for (const err of clean) {
    if (err.offset > cursor) {
      segments.push({ type: 'text', content: text.slice(cursor, err.offset) });
    }
    segments.push({
      type: 'error',
      content: text.slice(err.offset, err.offset + err.length),
      error: err,
    });
    cursor = err.offset + err.length;
  }

  if (cursor < text.length) {
    segments.push({ type: 'text', content: text.slice(cursor) });
  }

  return segments;
};

/** Rend un contenu texte brut en respectant les sauts de ligne. */
const RawText = ({ content }) =>
  content.split('\n').map((line, i, arr) => (
    <React.Fragment key={i}>
      {line}
      {i < arr.length - 1 && <br />}
    </React.Fragment>
  ));

const HighlightedText = ({ text, errors, activeError, onErrorClick }) => {
  if (!text) return null;

  const segments = buildSegments(text, errors);

  return (
    <div className="highlighted-text">
      {segments.map((seg, i) => {
        if (seg.type === 'text') {
          return (
            <span key={i}>
              <RawText content={seg.content} />
            </span>
          );
        }

        const style = ERROR_STYLES[seg.error.type] || ERROR_STYLES.other;
        const isActive = activeError === seg.error;

        return (
          <mark
            key={i}
            className={`ht-mark ht-mark--${seg.error.type}${isActive ? ' ht-mark--active' : ''}`}
            style={{
              backgroundColor: isActive
                ? `${style.color}18`
                : 'transparent',
              borderBottom: `2.5px ${isActive ? 'solid' : 'dotted'} ${style.color}`,
              borderRadius: '2px',
              cursor: 'pointer',
              padding: '0 1px',
            }}
            onClick={() => onErrorClick(seg.error)}
            title={`${style.label} : ${seg.error.shortMessage}`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onErrorClick(seg.error)}
          >
            <RawText content={seg.content} />
          </mark>
        );
      })}

      <style>{`
        .highlighted-text {
          font-family: inherit;
          font-size: 0.9375rem;
          line-height: 1.7;
          white-space: pre-wrap;
          word-break: break-word;
          color: var(--text-primary);
        }
        .ht-mark { transition: background-color 0.15s; }
        .ht-mark:hover {
          background-color: rgba(0,0,0,0.06) !important;
        }
      `}</style>
    </div>
  );
};

export default HighlightedText;
