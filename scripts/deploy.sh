#!/bin/bash
set -euo pipefail

# Deploy the DevOps Admin Platform to a local kind cluster (falls back to Minikube).

CLUSTER_NAME="${CLUSTER_NAME:-devops-platform}"

if command -v kind >/dev/null 2>&1; then
  echo "Creating kind cluster ${CLUSTER_NAME} (if needed)..."
  kind get clusters | grep -qx "${CLUSTER_NAME}" || kind create cluster --name "${CLUSTER_NAME}"
elif command -v minikube >/dev/null 2>&1; then
  echo "Starting Minikube..."
  minikube start
  minikube addons enable ingress
else
  echo "Neither kind nor minikube is installed" >&2
  exit 1
fi

echo "Deploying Kubernetes base manifests..."
kubectl apply -k infra/k8s/base

echo "Deployment complete. Check status with: kubectl get all"
