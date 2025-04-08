#!/bin/bash

set -e

# Step 6: Wait for deployments to become ready
deployments=(flask-backend frontend prometheus grafana loki)
for deployment in "${deployments[@]}"; do
    echo "⏳ Waiting for $deployment to become ready..."
    kubectl rollout status deployment/$deployment -n uber
done

echo "🛑 Killing existing port-forwards..."
pkill -f "kubectl port-forward" || true

kubectl port-forward -n $NAMESPACE svc/frontend-service 3001:80 &

# Step 7: Port forwarding services in the background
declare -A ports=(
    # [frontend-service]=5173:80
    [flask-backend]=5000:5000
    [prometheus]=9090:9090
    [grafana]=3000:3000
    [loki]=3100:3100
)

echo "🔗 Setting up port forwarding..."
for service in "${!ports[@]}"; do
    kubectl port-forward svc/$service ${ports[$service]} -n uber &
done

# Step 8: Print service access URLs
echo ""
echo "🌐 To access your services, use the following commands:"
for service in "prometheus grafana flask-backend frontend-service"; do
    echo "🟢 $service:"
    echo "minikube service $service -n uber --url"
    echo ""
done

# echo "📢 If using Vite for frontend development, run:"
# echo "cd Frontend && npm run dev"

echo "🔹 Services Running:"
echo "📁 Logs (Loki)        → http://localhost:3100"
echo "📈 Monitoring (Prometheus) → http://localhost:9090"
echo "📊 Dashboard (Grafana) → http://localhost:3000"
echo "🧠 Backend (Flask API) → http://localhost:5000"
# echo "🌍 Frontend        →  $FRONTEND_URL"
echo "🧠 Frontend → http://localhost:3001"