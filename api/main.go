package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/rs/cors"

	"devops-admin-platform/api/db"
	"devops-admin-platform/api/handlers"
)

func main() {
	// Подключение к PostgreSQL
	if err := db.ConnectPostgres(); err != nil {
		log.Fatalf("Failed to connect to PostgreSQL: %v", err)
	}
	log.Println("✅ Connected to PostgreSQL")

	// Подключение к Redis
	if err := db.ConnectRedis(); err != nil {
		log.Fatalf("Redis ping failed: %v", err)
	}
	log.Println("✅ Connected to Redis")

	// Настройка роутера
	r := mux.NewRouter()

	// Маршруты API
	r.HandleFunc("/api/nodes", handlers.GetNodes).Methods("GET")
	r.HandleFunc("/api/metrics", handlers.GetMetrics).Methods("GET")
	r.HandleFunc("/api/status", handlers.GetSystemStatus).Methods("GET")
	r.HandleFunc("/api/agents/{name}/restart", handlers.RestartAgent).Methods("POST")
	r.HandleFunc("/api/agents/{name}/disable", handlers.DisableAgent).Methods("POST")
	r.HandleFunc("/api/alerts/test", handlers.SendTestAlert).Methods("POST")

	// Middleware CORS
	handler := cors.Default().Handler(r)

	// Запуск сервера
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf(" API server running on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, handler))
}
