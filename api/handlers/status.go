package handlers

import (
	"encoding/json"
	"net/http"
)

type ComponentStatus struct {
	Name     string `json:"name"`
	Status   string `json:"status"`
	Link     string `json:"link"`
	Category string `json:"category"`
}

func GetSystemStatus(w http.ResponseWriter, r *http.Request) {
	components := []ComponentStatus{
		{Name: "API", Status: "✅", Link: "/api/status", Category: "Backend"},
		{Name: "UI", Status: "✅", Link: "/", Category: "Frontend"},
		{Name: "PostgreSQL", Status: "✅", Link: "/databases", Category: "Database"},
		{Name: "Redis", Status: "✅", Link: "/databases", Category: "Database"},
		{Name: "ArgoCD", Status: "✅", Link: "http://localhost:8082", Category: "GitOps"},
		{Name: "Prometheus", Status: "✅", Link: "http://localhost:9090", Category: "Monitoring"},
		{Name: "Grafana", Status: "✅", Link: "http://localhost:3001", Category: "Monitoring"},
		{Name: "Loki", Status: "✅", Link: "/logs", Category: "Logging"},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(components)
}
