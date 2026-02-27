# BudgetLens

Suivi financier intelligent - Application de gestion de finances personnelles.

## Architecture

Monorepo pnpm + Turborepo avec :

- **Backend** : FastAPI (Python) avec PostgreSQL et Redis
- **Frontend** : React + Vite + Tailwind CSS
- **Packages partages** : types, utils, ui, api-client, theme

## Demarrage rapide

### Prerequisites

- Node.js >= 20
- pnpm >= 9
- Python >= 3.12
- Docker & Docker Compose

### Infrastructure

```bash
docker-compose up -d
```

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 74000
```

### Frontend

```bash
pnpm install
pnpm dev:web
```

## Ports

| Service  | Port  |
|----------|-------|
| Frontend | 3500  |
| Backend  | 74000 |
| Postgres | 5432  |
| Redis    | 6379  |

## Structure

```
budgetlens/
  backend/          # FastAPI Python
  apps/web/         # React + Vite + Tailwind
  packages/
    types/          # TypeScript types partages
    utils/          # Fonctions utilitaires
    ui/             # Composants UI (charts, cards)
    api-client/     # Client API
    theme/          # Configuration du theme
```

## Theme

Couleur principale : Emerald `#10B981`

Support complet du mode sombre avec `budgetlens-theme` comme cle de stockage.
