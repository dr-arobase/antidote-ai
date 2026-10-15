import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [form, setForm]       = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors]   = useState({});
  const [apiError, setApiErr] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate     = useNavigate();

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((errs) => ({ ...errs, [e.target.name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim() || form.name.length < 2)
      errs.name = 'Le nom doit avoir au moins 2 caractères.';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email))
      errs.email = 'Email invalide.';
    if (!form.password || form.password.length < 8)
      errs.password = 'Au moins 8 caractères.';
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password))
      errs.password = 'Doit contenir majuscule, minuscule et chiffre.';
    if (form.password !== form.confirm)
      errs.confirm = 'Les mots de passe ne correspondent pas.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiErr('');
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/', { replace: true });
    } catch (err) {
      setApiErr(
        err.response?.data?.error ||
          err.response?.data?.errors?.[0]?.msg ||
          'Une erreur est survenue.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-card__header">
          <span className="auth-card__icon">✦</span>
          <h1 className="auth-card__title">Créer un compte</h1>
          <p className="auth-card__subtitle">Gratuit, sans carte bancaire.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {apiError && <div className="alert alert--error">{apiError}</div>}

          <div className="form-group">
            <label className="form-label" htmlFor="name">Prénom / Nom</label>
            <input
              id="name" name="name" type="text"
              className={`form-input${errors.name ? ' form-input--error' : ''}`}
              value={form.name} onChange={handleChange}
              placeholder="Jean Dupont" autoComplete="name"
            />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">Adresse email</label>
            <input
              id="reg-email" name="email" type="email"
              className={`form-input${errors.email ? ' form-input--error' : ''}`}
              value={form.email} onChange={handleChange}
              placeholder="vous@exemple.com" autoComplete="email"
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">Mot de passe</label>
            <input
              id="reg-password" name="password" type="password"
              className={`form-input${errors.password ? ' form-input--error' : ''}`}
              value={form.password} onChange={handleChange}
              placeholder="••••••••" autoComplete="new-password"
            />
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirm">Confirmer le mot de passe</label>
            <input
              id="confirm" name="confirm" type="password"
              className={`form-input${errors.confirm ? ' form-input--error' : ''}`}
              value={form.confirm} onChange={handleChange}
              placeholder="••••••••" autoComplete="new-password"
            />
            {errors.confirm && <span className="form-error">{errors.confirm}</span>}
          </div>

          <button
            type="submit" className="btn btn--primary"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {loading ? (
              <><span className="spinner" style={{ width: 16, height: 16 }} /> Création…</>
            ) : (
              'Créer mon compte'
            )}
          </button>
        </form>

        <p className="auth-card__footer">
          Déjà inscrit ? <Link to="/login">Se connecter</Link>
        </p>
      </div>

      <style>{`
        .auth-page {
          min-height: calc(100vh - 3.75rem);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          background: var(--bg-secondary);
        }
        .auth-card {
          width: 100%;
          max-width: 420px;
          padding: 2rem;
        }
        .auth-card__header {
          text-align: center;
          margin-bottom: 1.75rem;
        }
        .auth-card__icon {
          display: block;
          font-size: 2rem;
          color: var(--primary);
          margin-bottom: 0.5rem;
        }
        .auth-card__title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.25rem;
        }
        .auth-card__subtitle {
          font-size: 0.9rem;
          color: var(--text-muted);
        }
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .auth-card__footer {
          margin-top: 1.5rem;
          text-align: center;
          font-size: 0.875rem;
          color: var(--text-secondary);
        }
        .form-input--error {
          border-color: var(--danger) !important;
        }
      `}</style>
    </div>
  );
};

export default Register;
