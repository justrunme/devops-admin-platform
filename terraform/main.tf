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

resource "kubernetes_service_account" "api" {
  metadata {
    name      = "api"
    namespace = "default"
  }
}



resource "helm_release" "argocd" {
  name       = "argocd"
  repository = "https://argoproj.github.io/argo-helm"
  chart      = "argo-cd"
  namespace  = kubernetes_namespace.argocd.metadata[0].name

  create_namespace = true
  set = [
    {
      name  = "crds.install"
      value = "false"
    }
  ]
  depends_on = [null_resource.install_argocd_crds]
  wait             = true # Ensure ArgoCD is fully deployed before proceeding
  timeout          = 600
  atomic           = true
  cleanup_on_fail  = true
}

resource "kubernetes_manifest" "argocd_app" {
  field_manager {
    force_conflicts = true
  }
  depends_on = [
    helm_release.argocd
  ]

  manifest = yamldecode(templatefile("${path.module}/argocd-app.yaml.tmpl", {
    repo_url = var.repo_url
  }))
}
