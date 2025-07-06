package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
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

// GetNodes fetches and returns a list of Kubernetes nodes
func GetNodes(w http.ResponseWriter, r *http.Request) {
	nodeList, err := clientset.CoreV1().Nodes().List(context.Background(), metav1.ListOptions{})
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
