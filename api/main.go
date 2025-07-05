package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"os"
	

	"github.com/go-redis/redis/v8"
	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
)

var (
	db    *sql.DB
	rdb   *redis.Client
	ctx   = context.Background()
)

func main() {
	initPostgres()
	initRedis()

	r := mux.NewRouter()
	r.HandleFunc("/health", healthHandler).Methods("GET")
	r.HandleFunc("/ping", pingHandler).Methods("POST")

	log.Println("API server listening on :8080")
	http.ListenAndServe(":8080", r)
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
}

func initRedis() {
    redisURL := getEnv("REDIS_URL", "redis://localhost:6379")

    opt, err := redis.ParseURL(redisURL)
    if err != nil {
        log.Fatalf("Failed to parse REDIS_URL: %v", err)
    }

    rdb = redis.NewClient(opt)

    _, err = rdb.Ping(ctx).Result()
    if err != nil {
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
