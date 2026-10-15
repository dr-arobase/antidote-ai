# Antidote AI — Correcteur de texte intelligent

Application web full stack qui corrige automatiquement l'orthographe, la grammaire et le style en **français** et en **anglais**, avec une interface inspirée de Grammarly / Antidote.

---

## Architecture

```
antidote/
├── backend/                  # API Node.js + Express
│   ├── src/
│   │   ├── app.js            # Configuration Express (CORS, sécurité, routes)
│   │   ├── server.js         # Point d'entrée
│   │   ├── config/
│   │   │   └── database.js   # Connexion MongoDB
│   │   ├── models/
│   │   │   ├── User.js       # Schéma utilisateur
│   │   │   └── Text.js       # Schéma texte / historique
│   │   ├── controllers/
│   │   │   ├── authController.js      # register / login / getMe
│   │   │   ├── analysisController.js  # analyze
│   │   │   └── historyController.js   # CRUD historique
│   │   ├── services/
│   │   │   └── languageToolService.js # Intégration LanguageTool API
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── analysis.js
│   │   │   └── history.js
│   │   └── middleware/
│   │       ├── auth.js       # Vérification JWT
│   │       └── validate.js   # Validation des entrées
│   └── package.json
│
└── frontend/                 # Application React (Vite)
    ├── src/
    │   ├── App.jsx            # Routeur principal
    │   ├── context/
    │   │   ├── AuthContext.jsx   # Gestion de l'authentification
    │   │   └── ThemeContext.jsx  # Mode clair / sombre
    │   ├── hooks/
    │   │   └── useAnalysis.js   # Logique d'analyse + corrections
    │   ├── services/
    │   │   └── api.js           # Client Axios
    │   ├── components/
    │   │   ├── Layout/          # Navbar + Layout
    │   │   ├── Editor/          # TextEditor + HighlightedText
    │   │   ├── Suggestions/     # SuggestionPanel + SuggestionCard
    │   │   ├── Auth/            # Login + Register
    │   │   └── History/         # History + HistoryItem
    │   └── pages/               # Pages (Editor, Login, Register, History)
    └── package.json
```

---

## Fonctionnalités

| Fonctionnalité | Description |
|---|---|
| ✦ Correction de texte | Orthographe, grammaire, ponctuation, style |
| 🌐 Multilingue | Français, English (US/UK), Espagnol, Allemand |
| 🎯 Suggestions | Cliquez sur une erreur pour voir les suggestions et les appliquer |
| ⚡ Analyse auto | Option d'analyse en temps réel avec debounce |
| 🌙 Mode sombre | Basculement clair/sombre persistant |
| 🔒 Authentification | Inscription / connexion par JWT |
| 💾 Historique | Sauvegarde et restauration des textes corrigés |
| 🛡️ Sécurité | Helmet, rate limiting, validation, bcrypt |

---

## Prérequis

- [Node.js](https://nodejs.org/) ≥ 18
- [MongoDB](https://www.mongodb.com/) (local ou [Atlas](https://www.mongodb.com/atlas)) ≥ 6
- Accès internet (pour l'API LanguageTool publique gratuite)

---

## Installation et lancement

### 1. Cloner / ouvrir le projet

```bash
cd "antidote"
```

### 2. Configurer le backend

```bash
cd backend
npm install

# Copier le fichier d'environnement et ajuster les valeurs
cp .env.example .env
```

Éditez `backend/.env` :

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/antidote
JWT_SECRET=votre_cle_secrete_tres_longue_ici
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
LANGUAGE_TOOL_URL=https://api.languagetool.org/v2/check
```

### 3. Configurer le frontend

```bash
cd ../frontend
npm install
```

*(Optionnel)* Créez `frontend/.env` pour pointer vers un backend distant :

```env
VITE_API_URL=http://localhost:5000/api
```

Le proxy Vite (`vite.config.js`) redirige automatiquement `/api` → `http://localhost:5000` en développement.

### 4. Lancer les deux serveurs

**Terminal 1 — backend :**

```bash
cd backend
npm run dev
# → Serveur démarré sur le port 5000
```

**Terminal 2 — frontend :**

```bash
cd frontend
npm run dev
# → Application disponible sur http://localhost:5173
```

---

## Utilisation

1. Ouvrez **http://localhost:5173**
2. Saisissez un texte dans l'éditeur
3. Choisissez la langue (ou laissez sur Auto-détection)
4. Cliquez sur **✦ Corriger**
5. Les erreurs s'affichent soulignées dans l'aperçu
6. Cliquez sur une erreur → sélectionnez une suggestion pour l'appliquer
7. Inscrivez-vous pour sauvegarder vos textes et accéder à l'historique

---

## API Endpoints

### Auth

| Méthode | URL | Description |
|---|---|---|
| POST | `/api/auth/register` | Créer un compte |
| POST | `/api/auth/login` | Se connecter |
| GET  | `/api/auth/me` | Profil de l'utilisateur connecté |

### Analyse

| Méthode | URL | Description |
|---|---|---|
| POST | `/api/analysis/analyze` | Analyser un texte |

Corps : `{ "text": "...", "language": "fr" }`

Réponse :
```json
{
  "success": true,
  "data": {
    "errors": [
      {
        "offset": 12,
        "length": 5,
        "message": "Possible faute d'orthographe",
        "shortMessage": "Faute",
        "type": "spelling",
        "suggestions": ["correction1", "correction2"],
        "ruleId": "MORFOLOGIK_RULE_FR"
      }
    ],
    "detectedLanguage": "fr",
    "errorCount": 1
  }
}
```

### Historique (authentifié)

| Méthode | URL | Description |
|---|---|---|
| POST   | `/api/history` | Sauvegarder un texte |
| GET    | `/api/history` | Lister les textes |
| GET    | `/api/history/:id` | Détail d'un texte |
| DELETE | `/api/history/:id` | Supprimer un texte |

---

## Technologies

**Backend**
- Node.js + Express 4
- MongoDB + Mongoose 7
- JWT (jsonwebtoken) + bcryptjs
- LanguageTool API (NLP, gratuit)
- Helmet + express-rate-limit + express-validator

**Frontend**
- React 18 + Vite 5
- React Router DOM 6
- Axios
- CSS Variables (thème clair/sombre, zéro dépendance UI)

---

## Notes de sécurité

- Les mots de passe sont hachés avec bcrypt (coût 12)
- Les tokens JWT expirent en 7 jours
- Rate limiting : 100 req/15 min globaux, 20 req/min pour l'analyse
- Validation de toutes les entrées côté serveur (express-validator)
- CORS restreint à l'URL du client
- En production : changez `JWT_SECRET`, configurez HTTPS et MongoDB Atlas
