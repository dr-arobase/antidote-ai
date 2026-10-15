import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { historyAPI } from '../../services/api';

const HistoryItem = ({ item, onDelete, onRestore }) => {
  const [confirming, setConfirming] = useState(false);

  const date = new Date(item.createdAt).toLocaleDateString('fr-CA', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  const langLabel = {
    fr: '🇫🇷 FR', 'en-US': '🇺🇸 EN', 'en-GB': '🇬🇧 EN', auto: '🌐', es: '🇪🇸 ES', de: '🇩🇪 DE',
  }[item.detectedLanguage || item.language] || item.language;

  return (
    <div className="hi-card card">
      <div className="hi-card__body">
        <div className="hi-card__meta">
          <span className="hi-card__lang">{langLabel}</span>
          <span className="hi-card__date">{date}</span>
        </div>
        <p className="hi-card__title">{item.title}</p>
        {item.errorCount > 0 && (
          <span className="hi-card__errors">
            {item.errorCount} erreur{item.errorCount > 1 ? 's' : ''} corrigée{item.errorCount > 1 ? 's' : ''}
          </span>
        )}
      </div>
      <div className="hi-card__actions">
        <button className="btn btn--ghost btn--sm" onClick={() => onRestore(item)}>
          Restaurer
        </button>
        {confirming ? (
          <>
            <span className="hi-card__confirm-label">Supprimer ?</span>
            <button className="btn btn--danger btn--sm" onClick={() => onDelete(item._id)}>Oui</button>
            <button className="btn btn--ghost btn--sm" onClick={() => setConfirming(false)}>Non</button>
          </>
        ) : (
          <button className="btn btn--ghost btn--sm hi-card__delete-btn" onClick={() => setConfirming(true)}>
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

const History = ({ onRestore }) => {
  const { user } = useAuth();
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  React.useEffect(() => {
    if (!user) return;
    historyAPI
      .getAll()
      .then((res) => setItems(res.data.data))
      .catch(() => setError('Impossible de charger l\'historique.'))
      .finally(() => setLoading(false));
  }, [user]);

  const handleDelete = async (id) => {
    try {
      await historyAPI.delete(id);
      setItems((prev) => prev.filter((i) => i._id !== id));
    } catch {
      setError('Erreur lors de la suppression.');
    }
  };

  if (loading) {
    return (
      <div className="history-page">
        <div className="history-page__loading">
          <div className="spinner" />
          <span>Chargement…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="history-page">
      <div className="history-page__header">
        <h1 className="history-page__title">Historique</h1>
        <p className="history-page__subtitle">
          Vos {items.length} texte{items.length !== 1 ? 's' : ''} corrigé{items.length !== 1 ? 's' : ''}
        </p>
      </div>

      {error && <div className="alert alert--error" style={{ marginBottom: '1rem' }}>{error}</div>}

      {items.length === 0 ? (
        <div className="history-page__empty">
          <p className="history-page__empty-title">Aucun texte sauvegardé</p>
          <p className="history-page__empty-desc">
            Corrigez un texte depuis l'éditeur et sauvegardez-le.
          </p>
          <Link to="/" className="btn btn--primary">
            Aller à l'éditeur
          </Link>
        </div>
      ) : (
        <div className="history-page__list">
          {items.map((item) => (
            <HistoryItem
              key={item._id}
              item={item}
              onDelete={handleDelete}
              onRestore={onRestore}
            />
          ))}
        </div>
      )}

      <style>{`
        .history-page {
          max-width: 760px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
        }
        .history-page__loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 4rem;
          color: var(--text-muted);
        }
        .history-page__header { margin-bottom: 1.5rem; }
        .history-page__title {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .history-page__subtitle {
          color: var(--text-muted);
          font-size: 0.9rem;
          margin-top: 0.25rem;
        }
        .history-page__empty {
          text-align: center;
          padding: 4rem 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }
        .history-page__empty-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .history-page__empty-desc {
          color: var(--text-muted);
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }
        .history-page__list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        /* ── HistoryItem ── */
        .hi-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          gap: 1rem;
          transition: box-shadow var(--transition);
        }
        .hi-card:hover { box-shadow: var(--shadow); }
        .hi-card__body { flex: 1; min-width: 0; }
        .hi-card__meta {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          margin-bottom: 0.25rem;
        }
        .hi-card__lang {
          font-size: 0.75rem;
          font-weight: 600;
          background: var(--bg-surface);
          padding: 0.1rem 0.4rem;
          border-radius: 4px;
          color: var(--text-secondary);
        }
        .hi-card__date { font-size: 0.8rem; color: var(--text-muted); }
        .hi-card__title {
          font-size: 0.9375rem;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-weight: 500;
        }
        .hi-card__errors {
          display: inline-block;
          margin-top: 0.25rem;
          font-size: 0.75rem;
          color: var(--primary-dark);
          background: var(--primary-light);
          padding: 0.1rem 0.4rem;
          border-radius: 4px;
          font-weight: 600;
        }
        .hi-card__actions {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          flex-shrink: 0;
        }
        .hi-card__delete-btn { color: var(--text-muted); }
        .hi-card__delete-btn:hover { color: var(--danger); border-color: var(--danger); }
        .hi-card__confirm-label { font-size: 0.8rem; color: var(--text-secondary); }
      `}</style>
    </div>
  );
};

export default History;
