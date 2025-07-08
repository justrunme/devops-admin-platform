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

	// Интеграция с Kubernetes — только если USE_KUBERNETES=1
	if os.Getenv("USE_KUBERNETES") == "1" {
		initKube()
	} else {
		log.Println("Skipping Kubernetes integration (USE_KUBERNETES not set)")
	}

	// Настройка роутера
	r := mux.NewRouter()

	// Маршруты API
	r.HandleFunc("/api/nodes", handlers.GetNodes).Methods("GET")
	r.HandleFunc("/api/metrics", handlers.GetMetrics).Methods("GET")
	r.HandleFunc("/api/status", handlers.GetSystemStatus).Methods("GET")
	r.HandleFunc("/api/agents/{name}/restart", handlers.RestartAgent).Methods("POST")
	r.HandleFunc("/api/agents/{name}/disable", handlers.DisableAgent).Methods("POST")
	r.HandleFunc("/api/alerts/test", handlers.SendTestAlert).Methods("POST")
	r.HandleFunc("/api/alerts", handlers.GetAlerts).Methods("GET")
	r.HandleFunc("/health", handlers.HealthHandler).Methods("GET")

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

// Безопасная инициализация Kubernetes-клиента (опционально)
func initKube() {
	if _, err := os.Stat("/root/.kube/config"); os.IsNotExist(err) {
		log.Println("Kube config not found, skipping k8s integration")
		return
	}
	// Если потребуется интеграция с Kubernetes — раскомментируйте код ниже:
	/*
		import (
			"k8s.io/client-go/tools/clientcmd"
			"k8s.io/client-go/kubernetes"
		)
		config, err := clientcmd.BuildConfigFromFlags("", "/root/.kube/config")
		if err != nil {
			log.Printf("Failed to create Kubernetes config: %v", err)
			return
		}
		clientset, err := kubernetes.NewForConfig(config)
		if err != nil {
			log.Printf("Failed to create Kubernetes client: %v", err)
			return
		}
		// Используйте clientset для работы с Kubernetes API
	*/
}
