provider "helm" {
  kubernetes = {
    config_path = "~/.kube/config"
  }
}

provider "kubernetes" {
  config_path = "~/.kube/config"
}

resource "kubernetes_namespace" "monitoring" {
  metadata {
    name = "monitoring"
  }
}

resource "kubernetes_namespace" "argocd" {
  metadata {
    name = "argocd"
  }
}

resource "helm_release" "argocd" {
  name       = "argocd"
  repository = "https://argoproj.github.io/argo-helm"
  chart      = "argo-cd"
  namespace  = kubernetes_namespace.argocd.metadata[0].name

  create_namespace = true
  wait             = true # Ensure ArgoCD is fully deployed before proceeding
}

resource "null_resource" "wait_for_argocd_crds" {
  depends_on = [helm_release.argocd]

  provisioner "local-exec" {
    command = <<EOT
      echo "⏳ Waiting for ArgoCD Application CRD to become discoverable..."

      for i in {1..60}; do
        kubectl api-resources | grep -q "applications.argoproj.io" && break
        echo "⏳ Waiting... ($i)"
        sleep 5
      done

      if ! kubectl api-resources | grep -q "applications.argoproj.io"; then
        echo "❌ Timeout waiting for ArgoCD Application CRD"
        exit 1
      fi

      echo "✅ ArgoCD Application CRD is available to Terraform"
EOT
    interpreter = ["/bin/bash", "-c"]
  }
}

resource "kubernetes_manifest" "argocd_app" {
  depends_on = [null_resource.wait_for_argocd_crds]

  manifest = yamldecode(templatefile("${path.module}/argocd-app.yaml.tmpl", {
    repo_url = var.repo_url
  }))
}