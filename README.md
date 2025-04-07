# Glossary

- [Glossary](#glossary)
- [Frontend](#frontend)
    - [📁 Indirects](#-indirects)
- [Backend](#backend)
    - [📁 Indirects](#-indirects-1)
  - [.env for Frontend](#env-for-frontend)
  - [.env for Backend](#env-for-backend)
- [Containerization \& Orchestration (DevOps)](#containerization--orchestration-devops)
    - [📁 Indirects](#-indirects-2)
- [Dashboard](#dashboard)
- [How to Run](#how-to-run)

---

# Frontend

```bash
npm install
npm run dev
```

Runs on `http://localhost:5173/`

### 📁 Indirects

- [Component Structure Diagram](indirects/frontend/component-diagram.md)
- [State Flow Chart](indirects/frontend/state-flow.md)

---

# Backend

```bash
# Enter virtual environment
python3 -m venv venv
source venv/bin/activate
pip3 install -r requirements.txt

# Run backend
flask --app server.py run --debug  # Dev mode
flask --app server.py run          # Normal

# Production
gunicorn -w 1 -b 0.0.0.0:5000 --worker-class eventlet server:app
```

Runs on `http://localhost:5000/`

### 📁 Indirects

- [API Contract / Swagger Spec](/Backend/README.md)
- [Auth Flow Diagram](indirects/backend/auth-flow.md)
- [DB Schema ERD](indirects/backend/db-erd.png)

---

## .env for Frontend

```env
VITE_BASE_URL=http://127.0.0.1:5000
VITE_API_URL=http://127.0.0.1:5000
```

## .env for Backend

```env
DB_CONNECT='mysql+mysqlconnector://username:password@localhost:port/database'
JWT_SECRET_KEY='your_secret_key'
DEBUG_METRICS=1
STRIPE_SECRET_KEY="sk_te....***"
FRONTEND_URL="http://localhost:5173/"
```

---

# Containerization & Orchestration (DevOps)

```bash
chmod +x run.sh
./run.sh
```

> This uses Minikube to deploy services and launch the Grafana dashboard automatically.

### 📁 Indirects

- [Minikube Pod Structure](indirects/devops/minikube-pod-flow.md)
- [Dockerfile & Deployment Notes](indirects/devops/docker-notes.md)
- [Grafana Dashboards Setup](indirects/devops/grafana-setup.md)

---

# Dashboard

Runs via Grafana as part of the `run.sh` deployment. Monitors system metrics, resource usage, and custom application logs.

---

# How to Run

1. Start backend server (see above)
2. Start frontend server (see above)
3. Visit frontend on `http://localhost:5173/`
4. Backend APIs available on `http://localhost:5000/`

---