package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"devops-admin-platform/api/db"
)

type pingPayload struct {
	AgentID   string `json:"agent_id"`
	Hostname  string `json:"hostname"`
	Timestamp string `json:"timestamp"`
}

// PingHandler accepts agent heartbeats and upserts the agents table.
func PingHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var payload pingPayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}
	if payload.Hostname == "" {
		http.Error(w, "hostname required", http.StatusBadRequest)
		return
	}

	if db.DB != nil {
		_, err := db.DB.Exec(
			`INSERT INTO agents (hostname, uptime, os, last_seen)
			 VALUES ($1, $2, $3, $4)
			 ON CONFLICT (hostname) DO UPDATE
			 SET last_seen = EXCLUDED.last_seen`,
			payload.Hostname,
			0,
			"linux",
			time.Now().UTC(),
		)
		if err != nil {
			http.Error(w, "failed to store ping", http.StatusInternalServerError)
			return
		}
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}
