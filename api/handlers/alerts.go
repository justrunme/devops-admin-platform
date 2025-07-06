package handlers

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"
	"os"
)

// SendTestAlert sends a test alert to Alertmanager
func SendTestAlert(w http.ResponseWriter, r *http.Request) {
	alert := []map[string]interface{}{
		{
			"labels": map[string]string{
				"alertname": "ManualTestAlert",
				"severity":  "critical",
			},
			"annotations": map[string]string{
				"summary":     "Manual test alert",
				"description": "This is a test alert triggered manually.",
			},
		},
	}
	payload, _ := json.Marshal(alert)

	alertmanagerURL := os.Getenv("ALERTMANAGER_URL")
	if alertmanagerURL == "" {
		alertmanagerURL = "http://monitoring-kube-prometheus-alertmanager.monitoring.svc:9093"
	}

	resp, err := http.Post(alertmanagerURL+"/api/v1/alerts", "application/json", bytes.NewBuffer(payload))
	if err != nil {
		log.Printf("Failed to send alert to Alertmanager: %v", err)
		http.Error(w, "Failed to send alert: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Alert sent"})
}
