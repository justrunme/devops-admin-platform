package handlers

import (
	"log"

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
	log.Println("Kubernetes client initialized in handlers package")
}
