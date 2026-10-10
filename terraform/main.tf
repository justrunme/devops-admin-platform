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
  name             = "argocd"
  repository       = "https://argoproj.github.io/argo-helm"
  chart            = "argo-cd"
  version          = "10.10.2"
  namespace        = kubernetes_namespace.argocd.metadata[0].name
  create_namespace = false
  depends_on       = [null_resource.install_argocd_crds]
  wait             = true
  timeout          = 900
  atomic           = true
  cleanup_on_fail  = true

  set = [
    {
      name  = "crds.install"
      value = "false"
    },
    {
      name  = "configs.params.server\\.insecure"
      value = "true"
    },
    {
      name  = "dex.enabled"
      value = "false"
    },
    {
      name  = "notifications.enabled"
      value = "false"
    },
    {
      name  = "applicationSet.enabled"
      value = "false"
    },
    {
      name  = "server.resources.requests.cpu"
      value = "50m"
    },
    {
      name  = "server.resources.requests.memory"
      value = "64Mi"
    },
    {
      name  = "controller.resources.requests.cpu"
      value = "100m"
    },
    {
      name  = "controller.resources.requests.memory"
      value = "128Mi"
    },
    {
      name  = "repoServer.resources.requests.cpu"
      value = "50m"
    },
    {
      name  = "repoServer.resources.requests.memory"
      value = "64Mi"
    }
  ]
}

resource "kubernetes_manifest" "argocd_app" {
  field_manager {
    force_conflicts = true
  }
  depends_on = [
    helm_release.argocd,
    null_resource.wait_for_argocd_crds
  ]

  manifest = yamldecode(templatefile("${path.module}/argocd-app.yaml.tmpl", {
    repo_url = var.repo_url
  }))
}
