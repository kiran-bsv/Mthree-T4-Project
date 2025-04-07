

# 🚀 **Uber**

- [🚀 **Uber**](#-uber)
  - [🔧 Dev](#-dev)
    - [🎨 **Frontend**](#-frontend)
      - [📁 Frontend Indirects](#-frontend-indirects)
      - [🛠️ .env for Frontend](#️-env-for-frontend)
    - [⚙️ **Backend**](#️-backend)
      - [📁 Backend Indirects](#-backend-indirects)
      - [🛠️ .env for Backend](#️-env-for-backend)
  - [🐳 devops](#-devops)
    - [☸️ **Kubernetes (k8s)**](#️-kubernetes-k8s)
    - [📁 DevOps Indirects](#-devops-indirects)
  - [🧠 sre](#-sre)
    - [**Monitoring and Alertings**](#monitoring-and-alertings)
  - [▶️ How to Run](#️-how-to-run)

---

## 🔧 Dev

---

### 🎨 **Frontend**

```bash
npm install
npm run dev
```

🌐 Runs at: `http://localhost:5173/`

#### 📁 Frontend Indirects

- 📄 [Overview](/Frontend)
- 🧩 [Component Structure Diagram](/Documentation/Sequnce_diagram.png)
- 🔄 [State Flow Chart](/Frontend/src/README.md)

#### 🛠️ .env for Frontend

```env
VITE_BASE_URL=http://127.0.0.1:5000
VITE_API_URL=http://127.0.0.1:5000
```

---

### ⚙️ **Backend**

```bash
# 🔒 Enter virtual environment
python3 -m venv venv
source venv/bin/activate

# 📦 Install dependencies
pip3 install -r requirements.txt

# ▶️ Run server
flask --app server.py run --debug  # Dev mode
flask --app server.py run          # Normal

# 🚀 Production server
gunicorn -w 1 -b 0.0.0.0:5000 --worker-class eventlet server:app
```

🌐 Runs at: `http://localhost:5000/`

#### 📁 Backend Indirects

- 📘 [API Contract / Swagger Spec](/Backend/README.md)
- 🔐 [Auth Flow Diagram](indirects/backend/auth-flow.md)
- 🗃️ [DB Schema ERD](Documentation/Uber-ER-diagram.png)

#### 🛠️ .env for Backend

```env
DB_CONNECT='mysql+mysqlconnector://username:password@localhost:port/database'
JWT_SECRET_KEY='your_secret_key'
DEBUG_METRICS=1
STRIPE_SECRET_KEY="sk_te....***"
FRONTEND_URL="http://localhost:5173/"
```

---

## 🐳 devops

---

### ☸️ **Kubernetes (k8s)**

```bash
chmod +x run.sh
./run.sh
```

> 🧠 *This script deploys services via Minikube and launches the Grafana dashboard automatically.*

### 📁 DevOps Indirects

- 🧱 [Minikube Pod Structure](indirects/devops/minikube-pod-flow.md)
- 🐳 [Dockerfile & Deployment Notes](indirects/devops/docker-notes.md)
- 📊 [Grafana Dashboards Setup](indirects/devops/grafana-setup.md)

---

## 🧠 sre

### **Monitoring and Alertings**
  - [Grafana visulaizations](Documentation/grafana_panels_summary.md)
  - 📈 SLOs, SLIs, and Error Budgets
  - 🔔 Monitoring and Alerting strategies

---

## ▶️ How to Run

1. 🔁 Start the **backend server** – see [Backend](#backend)
2. 🖥️ Start the **frontend server** – see [Frontend](#frontend)
3. 🔗 Visit the app at: `http://localhost:5173/`
4. ⚙️ Backend APIs live at: `http://localhost:5000/`

---