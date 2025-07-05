resource "null_resource" "wait_for_cert_manager_crds" {
  depends_on = [null_resource.install_cert_manager_crds]

  provisioner "local-exec" {
    command = <<EOT
      echo "⏳ Waiting for ClusterIssuer CRD to become available..."
      for i in {1..30}; do
        kubectl get crd clusterissuers.cert-manager.io >/dev/null 2>&1 && \
        kubectl get crd certificaterequests.cert-manager.io >/dev/null 2>&1 && \
        break
        echo "Waiting... ($i)"
        sleep 2
      done
      echo "✅ cert-manager CRDs are ready."
EOT
    interpreter = ["/bin/bash", "-c"]
  }

  triggers = {
    always_run = timestamp()
  }
}

resource "null_resource" "wait_for_argocd_crds" {
  depends_on = [null_resource.install_argocd_crds]

  provisioner "local-exec" {
    command = <<EOT
      echo "⏳ Waiting for ArgoCD CRDs..."
      for i in {1..30}; do
        kubectl get crd applications.argoproj.io >/dev/null 2>&1 && break
        echo "Waiting... ($i)"
        sleep 2
      done
      echo "✅ ArgoCD CRDs are ready."
EOT
    interpreter = ["/bin/bash", "-c"]
  }

  triggers = {
    always_run = timestamp()
  }
}
