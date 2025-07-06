package handlers

import (
	"encoding/json"
	"net/http"
	"os/exec"
)

func GetHelmDeployments(w http.ResponseWriter, r *http.Request) {
	cmd := exec.Command("helm", "list", "--all-namespaces", "--output", "json")
	output, err := cmd.Output()
	if err != nil {
		http.Error(w, "Failed to list Helm releases: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(output)
}
