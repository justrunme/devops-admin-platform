package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"devops-admin-platform/api/db"

	"github.com/gorilla/mux"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
)

var clientset *kubernetes.Clientset

func init() {
	// creates the in-cluster config
	config, err := rest.InClusterConfig()
	if err != nil {
		log.Fatalf("Failed to create in-cluster config: %v", err)
	}
	// creates the clientset
	clientset, err = kubernetes.NewForConfig(config)
	
	if err != nil {
		log.Fatalf("Failed to create clientset: %v", err)
	}
	log.Println("Kubernetes client initialized")
}

// AgentInfo represents the structure of agent information
type AgentInfo struct {
	Hostname string `json:"hostname"`
	Uptime   int    `json:"uptime"`
	OS       string `json:"os"`
	LastSeen string `json:"last_seen"`
}

// handlePostAgent handles POST requests to /api/agents
func PostAgent(w http.ResponseWriter, r *http.Request) {
	var agent AgentInfo
	if err := json.NewDecoder(r.Body).Decode(&agent); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	_, err := db.DB.Exec(`INSERT INTO agents (hostname, uptime, os, last_seen)
                         VALUES ($1, $2, $3, NOW())
                         ON CONFLICT (hostname) DO UPDATE
                         SET uptime = $2, os = $3, last_seen = NOW()`, 
		agent.Hostname, agent.Uptime, agent.OS)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

// handleGetAgents handles GET requests to /api/agents
func GetAgents(w http.ResponseWriter, r *http.Request) {
	rows, err := db.DB.Query(`SELECT hostname, uptime, os, last_seen FROM agents`)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var agents []AgentInfo
	for rows.Next() {
		var a AgentInfo
		var lastSeen time.Time
		err := rows.Scan(&a.Hostname, &a.Uptime, &a.OS, &lastSeen)
		if err == nil {
			agents = append(agents, AgentInfo{
				Hostname: a.Hostname,
				Uptime:   a.Uptime,
				OS:       a.OS,
				LastSeen: lastSeen.Format(time.RFC3339),
			})
		}
	}

	json.NewEncoder(w).Encode(agents)
}

// RestartAgent restarts an agent pod
func RestartAgent(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	name := vars["name"]

	log.Printf("⏳ Restart request received for agent: %s", name)

	// Get the agent pod name from the database (assuming hostname is the pod name)
	// In a real scenario, you might store pod names or labels in the DB
	podName := name // For simplicity, assuming hostname is the pod name

	err := clientset.CoreV1().Pods("default").Delete(context.Background(), podName, metav1.DeleteOptions{})
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to delete agent pod %s: %v", podName, err), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(fmt.Sprintf("Agent %s restart triggered", name)))
}

// DisableAgent disables an agent (simulated by deleting the pod)
func DisableAgent(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	name := vars["name"]

	log.Printf(" Disable request for agent: %s", name)

	// In a real scenario, you might update a status in the DB or send a command to the agent
	// For now, we'll simulate disabling by deleting the pod
	podName := name // For simplicity, assuming hostname is the pod name

	err := clientset.CoreV1().Pods("default").Delete(context.Background(), podName, metav1.DeleteOptions{})
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to disable agent %s: %v", podName, err), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(fmt.Sprintf("Agent %s disabled", name)))
}
