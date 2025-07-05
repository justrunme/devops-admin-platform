package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"os"
	"time"

	"github.com/go-redis/redis/v8"
	"github.com/gorilla/mux"
	_ "github.com/lib/pq"

	// Kubernetes client-go imports
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
)

var (
	db    *sql.DB
	rdb   *redis.Client
	ctx   = context.Background()
	clientset *kubernetes.Clientset // Kubernetes client
)

// NodeInfo represents the simplified structure of node information for the UI
type NodeInfo struct {
	Name      string `json:"name"`
	Status    string `json:"status"`
	Version   string `json:"version"`	
	CreatedAt string `json:"createdAt"`
	CPU       string `json:"cpu"`
	Memory    string `json:"memory"`
}

// LogEntry represents a single log entry from Loki
type LogEntry struct {
	Time    string `json:"time"`
	Message string `json:"message"`
	Source  string `json:"source"`
}

// AgentInfo represents the structure of agent information
type AgentInfo struct {
	Hostname string `json:"hostname"`
	Uptime   int    `json:"uptime"`
	OS       string `json:"os"`
	LastSeen string `json:"last_seen"`
}

func main() {
	initPostgres()
	initRedis()
	initKubernetesClient() // Initialize Kubernetes client

	r := mux.NewRouter()
	r.HandleFunc("/health", healthHandler).Methods("GET")
	r.HandleFunc("/ping", pingHandler).Methods("POST")
	r.HandleFunc("/api/nodes", getNodesHandler).Methods("GET") // New endpoint
	r.HandleFunc("/api/logs", getLogsHandler).Methods("GET") // New endpoint for logs
	r.HandleFunc("/api/agents", handlePostAgent).Methods("POST") // New endpoint for agents
	r.HandleFunc("/api/agents", handleGetAgents).Methods("GET") // New endpoint for agents
	r.HandleFunc("/api/metrics", handleGetMetrics).Methods("GET") // New endpoint for metrics

	log.Println("API server listening on :8080")
	http.ListenAndServe(":8080", r)
}

// initKubernetesClient initializes the Kubernetes client
func initKubernetesClient() {
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

// getNodesHandler fetches and returns a list of Kubernetes nodes
func getNodesHandler(w http.ResponseWriter, r *http.Request) {
	nodeList, err := clientset.CoreV1().Nodes().List(ctx, metav1.ListOptions{})
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to get nodes: %v", err), http.StatusInternalServerError)
		return
	}

	var nodesInfo []NodeInfo
	for _, node := range nodeList.Items {
		name := node.Name
		status := "Unknown"
		for _, condition := range node.Status.Conditions {
			if condition.Type == corev1.NodeReady {
				status = string(condition.Status)
				break
			}
		}
		version := node.Status.NodeInfo.KubeletVersion
		createdAt := node.CreationTimestamp.Format(time.RFC822)
		cpu := node.Status.Capacity.Cpu().String()
		memory := node.Status.Capacity.Memory().String()

		nodesInfo = append(nodesInfo, NodeInfo{
			Name:      name,
			Status:    status,
			Version:   version,
			CreatedAt: createdAt,
			CPU:       cpu,
			Memory:    memory,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(nodesInfo)
}

// getLogsHandler fetches and returns logs from Loki
func getLogsHandler(w http.ResponseWriter, r *http.Request) {
	lokiURL := getEnv("LOKI_URL", "http://loki:3100")
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

	body, err := ioutil.ReadAll(resp.Body)
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

// handlePostAgent handles POST requests to /api/agents
func handlePostAgent(w http.ResponseWriter, r *http.Request) {
	var agent AgentInfo
	if err := json.NewDecoder(r.Body).Decode(&agent); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	_, err := db.Exec(`INSERT INTO agents (hostname, uptime, os, last_seen)
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
func handleGetAgents(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query(`SELECT hostname, uptime, os, last_seen FROM agents`)
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

// handleGetMetrics fetches and returns metrics from Prometheus
func handleGetMetrics(w http.ResponseWriter, r *http.Request) {
	prometheusURL := getEnv("PROMETHEUS_URL", "http://prometheus-server.monitoring.svc.cluster.local")
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

func initPostgres() {
	connStr := getEnv("DATABASE_URL", "postgres://app:secret@localhost:5432/app?sslmode=disable")

	var err error
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatalf("PostgreSQL connect error: %v", err)
	}

	if err = db.Ping(); err != nil {
		log.Fatalf("PostgreSQL ping failed: %v", err)
	}

	log.Println("Connected to PostgreSQL")

	// Create agents table if it doesn't exist
	createTableSQL := `CREATE TABLE IF NOT EXISTS agents (
		hostname TEXT PRIMARY KEY,
		uptime INTEGER,
		os TEXT,
		last_seen TIMESTAMP
	);`

	_, err = db.Exec(createTableSQL)
	if err != nil {
		log.Fatalf("Failed to create agents table: %v", err)
	}
	log.Println("Agents table ensured.")
}

func initRedis() {
    url := getEnv("REDIS_URL", "redis://localhost:6379")

    opt, err := redis.ParseURL(url)
    if err != nil {
        log.Fatalf("Failed to parse Redis URL: %v", err)
    }

    rdb = redis.NewClient(opt)

    if _, err := rdb.Ping(ctx).Result(); err != nil {
        log.Fatalf("Redis ping failed: %v", err)
    }

    log.Println("Connected to Redis")
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("OK"))
}

func pingHandler(w http.ResponseWriter, r *http.Request) {
	var payload struct {
		AgentID   string `json:"agent_id"`
		Hostname  string `json:"hostname"`
		Timestamp string `json:"timestamp"`
	}

	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	log.Printf("Received ping from agent %s (%s) at %s", payload.AgentID, payload.Hostname, payload.Timestamp)
	w.WriteHeader(http.StatusOK)
}

func getEnv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}