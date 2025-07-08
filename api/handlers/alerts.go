package handlers

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
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

// GetAlerts возвращает список алертов с severity и time
func GetAlerts(w http.ResponseWriter, r *http.Request) {
	alertmanagerURL := os.Getenv("ALERTMANAGER_URL")
	if alertmanagerURL == "" {
		alertmanagerURL = "http://monitoring-kube-prometheus-alertmanager.monitoring.svc:9093"
	}

	resp, err := http.Get(alertmanagerURL + "/api/v1/alerts")
	if err != nil {
		http.Error(w, "Failed to fetch alerts: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		http.Error(w, "Failed to read response: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Структура ответа Alertmanager
	type AMAlert struct {
		Labels      map[string]string `json:"labels"`
		Annotations map[string]string `json:"annotations"`
		StartsAt    string            `json:"startsAt"`
		// EndsAt, GeneratorURL, etc. можно добавить при необходимости
	}
	type AMResponse struct {
		Data []AMAlert `json:"data"`
	}

	var amResp struct {
		Status string    `json:"status"`
		Data   []AMAlert `json:"data"`
	}
	if err := json.Unmarshal(body, &amResp); err != nil {
		http.Error(w, "Failed to parse Alertmanager response: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Преобразуем к фронтовому виду
	type Alert struct {
		Message  string `json:"message"`
		Severity string `json:"severity"`
		Time     string `json:"time"`
	}
	var alerts []Alert
	for _, a := range amResp.Data {
		alerts = append(alerts, Alert{
			Message:  a.Annotations["summary"],
			Severity: a.Labels["severity"],
			Time:     a.StartsAt,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{"alerts": alerts})
}
