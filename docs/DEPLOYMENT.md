# StockSense Deployment & Hackathon Git Workflow Guide

## 1. Quick Local Setup

### Step 1: Clone Repository
```bash
git clone <YOUR_REPO_URL>
cd odoo
```

### Step 2: Backend Setup (Django + PostgreSQL)
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# Linux / macOS
source venv/bin/activate

pip install -r requirements.txt
cp ../.env.example .env

# Run Migrations
python manage.py makemigrations
python manage.py migrate

# Create Admin User
python manage.py createsuperuser

# Start Django Development Server (port 8000)
python manage.py runserver
```

### Step 3: Frontend Setup (Next.js + Three.js)
```bash
cd ../frontend
npm install
npm run dev
# Accessible at http://localhost:3000
```

---

## 2. Docker One-Command Setup

For evaluators and quick local tests:
```bash
docker-compose up --build
```
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000/api`
- Django Admin: `http://localhost:8000/admin`

---

## 3. Hackathon 30-Minute Git Push Workflow

To satisfy the evaluator requirement of continuous activity from all 4 team members:

### Feature Branch Strategy
Each member should work on a designated branch matching their role:

1. **Frontend Dev 1**: `feat/frontend-auth-dashboard`
2. **Frontend Dev 2**: `feat/frontend-operations-3d`
3. **Backend Dev 1**: `feat/backend-auth-products-warehouse`
4. **Backend Dev 2**: `feat/backend-operations-ledger-realtime`

### 30-Minute Periodic Commit & Push Routine
Every team member can run this quick workflow every 30 minutes:
```bash
git status
git add .
git commit -m "feat(<module>): implement <specific_feature_name>"
git push origin <your-branch-name>
```

### Evaluator-Ready Commit Messages Examples:
- `feat(auth): implement OTP generation and verification service`
- `feat(products): add stock quant availability per location endpoint`
- `feat(operations): implement atomic stock deduction for delivery validation`
- `feat(3d-warehouse): build Three.js rack mesh and capacity heatmap`
- `feat(dashboard): add dynamic status and warehouse filters with live WebSocket updates`
- `feat(voice): implement hands-free Web Speech API for stock counting`
