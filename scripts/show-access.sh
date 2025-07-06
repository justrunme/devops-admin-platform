#!/bin/bash
echo " Access Info"

echo -e "\n DevOps UI:          http://localhost:3000"
echo " API Endpoint:       http://localhost:8080"
echo " Grafana:            http://grafana.localhost"
echo " Prometheus:         http://prometheus.localhost"
echo " PostgreSQL:         postgres://admin:<yourpass>@postgres-service:5432"
echo " Redis:              redis://redis-master:6379"

echo -e "\n Grafana Password:"
kubectl get secret -n monitoring monitoring-grafana -o jsonpath="{.data.admin-password}" | base64 --decode
echo
