minikube delete --all

echo "🚀 Running the application"

set -e

# Step 1: Start Minikube
# 🚀 Ensure namespace exists
# NAMESPACE="uber"
# echo "🚀 Ensuring namespace '$NAMESPACE' exists..."
# kubectl get ns $NAMESPACE >/dev/null 2>&1 || kubectl create ns $NAMESPACE

minikube start

# Step 2: Use Docker env for Minikube
eval $(minikube -p minikube docker-env)

# Step 3: Delete and recreate namespace
echo "🔁 Resetting 'uber' namespace..."
kubectl delete namespace uber --ignore-not-found
kubectl create namespace uber

# Step 4: Build backend Docker image
echo "🐳 Building backend Docker image..."
cd Backend
docker build -t backend-api:latest .
cd ..

# Step 5: Build frontend (Vite-based)
echo "🐳 Building frontend Docker image (Vite)..."
cd Frontend
docker build -t frontend:latest .

# Step 6: Load Docker images into Minikube
echo "📥 Loading images into Minikube..."
minikube image load backend-api:latest
minikube image load frontend:latest

cd ..

# Step 7: Deploy Kubernetes manifests
echo "🔐 Applying secrets and deploying all services..."
kubectl apply -f k8s/ --namespace=uber
kubectl apply -f k8s/configs --namespace=uber
kubectl apply -f k8s/secrets --namespace=uber
kubectl apply -f k8s/services --namespace=uber
kubectl apply -f k8s/deployments --namespace=uber


# echo "Creating the deployment - frontend"
# kubectl apply -f fe-deployment.yaml

# Step 8: Wait for deployments to become ready
echo "⏳ Waiting for deployments to become ready..."
kubectl rollout status deployment/flask-backend -n uber
kubectl rollout status deployment/frontend -n uber
kubectl rollout status deployment/prometheus -n uber
kubectl rollout status deployment/grafana -n uber
kubectl rollout status deployment/loki -n uber

# echo "Porforwarding the services fronend 5173:80 and backend 5000:5000"
# kubectl port-forward svc/frontend-service 5173:80 -n uber
# kubectl port-forward svc/flask-backend 5000:5000 -n uber
# kubectl port-forward svc/prometheus 9090:9090 -n uber
# kubectl port-forward svc/loki 3100:3100 -n uber
# kubectl port-forward svc/grafana 3000:3000 -n uber

# echo "Opening the Minikube dashboard"
# minikube dashboard

# Step 9: Print service access commands instead of running them
echo ""
echo "🌐 To access your services, run the following commands manually in another terminal:"
echo ""
echo "🟢 Prometheus:"
echo "minikube service prometheus -n uber --url"
echo ""
echo "🟢 Grafana:"
echo "minikube service grafana -n uber --url"
echo ""
echo "🟢 Flask Backend:"
echo "minikube service flask-backend -n uber --url"
echo ""
echo "🟢 Frontend:"
echo "minikube service frontend-service -n uber --url"
echo ""
echo "📢 If you're using Vite for frontend development, you can also run:"
echo "cd Frontend && npm run dev"

