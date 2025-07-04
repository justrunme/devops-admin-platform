#!/bin/bash

# Script to deploy the DevOps Admin Platform to Minikube

echo "Starting Minikube..."
minikube start

echo "Enabling Ingress addon..."
minikube addons enable ingress

echo "Deploying Kubernetes base manifests..."
kubectl apply -k infra/k8s/base

echo "Deployment complete. You can check the status with: kubectl get all"
