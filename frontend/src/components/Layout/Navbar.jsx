import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

/* Icônes SVG inline (pas de dépendance externe) */
const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-icon">✦</span>
          Antidote AI
        </Link>

        {/* Navigation */}
        <div className="navbar__links">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `navbar__link ${isActive ? 'navbar__link--active' : ''}`
            }
          >
            Éditeur
          </NavLink>
          {user && (
            <NavLink
              to="/history"
              className={({ isActive }) =>
                `navbar__link ${isActive ? 'navbar__link--active' : ''}`
              }
            >
              Historique
            </NavLink>
          )}
        </div>

        {/* Actions */}
        <div className="navbar__actions">
          {/* Bouton thème */}
          <button
            className="navbar__icon-btn"
            onClick={toggleTheme}
            title={theme === 'light' ? 'Mode sombre' : 'Mode clair'}
            aria-label="Changer le thème"
          >
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </button>

          {user ? (
            <div className="navbar__user">
              <button
                className="navbar__user-btn"
                onClick={() => setMenuOpen((o) => !o)}
              >
                <span className="navbar__avatar">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="navbar__user-name">{user.name}</span>
                <span style={{ fontSize: '0.75rem' }}>▾</span>
              </button>
              {menuOpen && (
                <div className="navbar__dropdown">
                  <span className="navbar__dropdown-email">{user.email}</span>
                  <button
                    className="navbar__dropdown-item navbar__dropdown-item--danger"
                    onClick={handleLogout}
                  >
                    Se déconnecter
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="navbar__auth">
              <Link to="/login" className="btn btn--ghost btn--sm">
                Connexion
              </Link>
              <Link to="/register" className="btn btn--primary btn--sm">
                S'inscrire
              </Link>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          background: var(--bg-primary);
          border-bottom: 1px solid var(--border);
          box-shadow: var(--shadow-sm);
        }
        .navbar__inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1.5rem;
          height: 3.75rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .navbar__logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--text-primary);
          text-decoration: none;
          white-space: nowrap;
        }
        .navbar__logo-icon { color: var(--primary); font-size: 1.25rem; }
        .navbar__links {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          flex: 1;
        }
        .navbar__link {
          padding: 0.375rem 0.75rem;
          border-radius: var(--radius);
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-secondary);
          text-decoration: none;
          transition: all var(--transition);
        }
        .navbar__link:hover { color: var(--text-primary); background: var(--bg-surface); text-decoration: none; }
        .navbar__link--active { color: var(--primary); background: var(--primary-light); }
        .navbar__actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .navbar__icon-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2rem;
          height: 2rem;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          background: transparent;
          color: var(--text-secondary);
          transition: all var(--transition);
        }
        .navbar__icon-btn:hover { background: var(--bg-surface); color: var(--text-primary); }
        .navbar__auth { display: flex; gap: 0.5rem; }
        .navbar__user { position: relative; }
        .navbar__user-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.375rem 0.625rem;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          background: transparent;
          color: var(--text-primary);
          font-size: 0.875rem;
          font-weight: 500;
          transition: all var(--transition);
        }
        .navbar__user-btn:hover { background: var(--bg-surface); }
        .navbar__avatar {
          width: 1.75rem;
          height: 1.75rem;
          border-radius: 50%;
          background: var(--primary);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
        }
        .navbar__user-name { max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .navbar__dropdown {
          position: absolute;
          top: calc(100% + 0.5rem);
          right: 0;
          min-width: 200px;
          background: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          padding: 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .navbar__dropdown-email {
          display: block;
          padding: 0.375rem 0.625rem;
          font-size: 0.8rem;
          color: var(--text-muted);
          border-bottom: 1px solid var(--border);
          margin-bottom: 0.25rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .navbar__dropdown-item {
          padding: 0.5rem 0.625rem;
          border-radius: var(--radius-sm);
          border: none;
          background: transparent;
          font-size: 0.875rem;
          text-align: left;
          color: var(--text-primary);
          transition: background var(--transition);
          width: 100%;
        }
        .navbar__dropdown-item:hover { background: var(--bg-surface); }
        .navbar__dropdown-item--danger { color: var(--danger); }
        .navbar__dropdown-item--danger:hover { background: var(--danger-light); }
        .layout { min-height: 100vh; display: flex; flex-direction: column; }
        .layout__main { flex: 1; }
      `}</style>
    </nav>
  );
};

export default Navbar;
