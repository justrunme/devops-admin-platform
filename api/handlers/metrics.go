package handlers

import (
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
)

func GetMetrics(w http.ResponseWriter, r *http.Request) {
	prometheusURL := os.Getenv("PROMETHEUS_URL")
	if prometheusURL == "" {
		prometheusURL = "http://prometheus-server.monitoring.svc.cluster.local"
	}
	query := r.URL.Query().Get("query")

	if query == "" {
		query = `100 - (avg by(instance)(rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)` // Default query for CPU usage
	}

	prometheusQueryURL := fmt.Sprintf("%s/api/v1/query?query=%s", prometheusURL, url.QueryEscape(query))

	resp, err := http.Get(prometheusQueryURL)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to query Prometheus: %v", err), http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	// Copy the response body directly to the client
	_, err = io.Copy(w, resp.Body)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to read Prometheus response: %v", err), http.StatusInternalServerError)
		return
	}
}
