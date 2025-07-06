package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
)

// LogEntry represents a single log entry from Loki
type LogEntry struct {
	Time    string `json:"time"`
	Message string `json:"message"`
	Source  string `json:"source"`
}

// GetLogs fetches and returns logs from Loki
func GetLogs(w http.ResponseWriter, r *http.Request) {
	lokiURL := os.Getenv("LOKI_URL")
	if lokiURL == "" {
		lokiURL = "http://loki:3100"
	}
	query := r.URL.Query().Get("query")
	limit := r.URL.Query().Get("limit")

	if query == "" {
		query = "{job=\"kubernetes-pods\"}" // Default query
	}
	
	if limit == "" {
		limit = "100" // Default limit
	}

	lokiQueryURL := fmt.Sprintf("%s/loki/api/v1/query_range?query=%s&limit=%s", lokiURL, url.QueryEscape(query), limit)

	resp, err := http.Get(lokiQueryURL)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to query Loki: %v", err), http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to read Loki response: %v", err), http.StatusInternalServerError)
		return
	}

	var lokiResponse struct {
		Data struct {
			ResultType string `json:"resultType"`
			Result     []struct {
				Stream map[string]string `json:"stream"`
				Values [][]string        `json:"values"`
			} `json:"result"`
		} `json:"data"`
	}

	if err := json.Unmarshal(body, &lokiResponse); err != nil {
		http.Error(w, fmt.Sprintf("Failed to unmarshal Loki response: %v", err), http.StatusInternalServerError)
		return
	}

	var logEntries []LogEntry
	for _, result := range lokiResponse.Data.Result {
		for _, value := range result.Values {
			timestamp := value[0]
			message := value[1]
			source := result.Stream["app"] // Assuming 'app' label indicates the source

			logEntries = append(logEntries, LogEntry{
				Time:    timestamp,
				Message: message,
				Source:  source,
			})
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(logEntries)
}