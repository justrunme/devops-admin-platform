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

resource "helm_release" "cert_manager" {
  name       = "cert-manager"
  namespace  = "cert-manager"
  repository = "https://charts.jetstack.io"
  chart      = "cert-manager"
  version    = "v1.15.0"

  create_namespace = true

  set {
    name  = "installCRDs"
    value = "true"
  }
}

resource "helm_release" "kube_prometheus" {
  name       = "monitoring"
  namespace  = kubernetes_namespace.monitoring.metadata[0].name
  repository = "prometheus-community"
  chart      = "kube-prometheus-stack"

  set {
    name  = "grafana.adminPassword"
    value = "admin123"
  }

  set {
    name  = "grafana.ingress.enabled"
    value = "true"
  }

  set {
    name  = "grafana.ingress.annotations.\"cert-manager\\.io/cluster-issuer\""
    value = "letsencrypt-staging"
  }

  set {
    name  = "grafana.ingress.hosts[0]"
    value = "grafana.devops.local"
  }

  set {
    name  = "grafana.ingress.tls[0].hosts[0]"
    value = "grafana.devops.local"
  }

  set {
    name  = "grafana.ingress.tls[0].secretName"
    value = "grafana-tls"
  }

  depends_on = [helm_release.cert_manager]
}

resource "helm_release" "loki" {
  name       = "loki"
  namespace  = kubernetes_namespace.monitoring.metadata[0].name
  repository = "grafana"
  chart      = "loki-stack"

  set {
    name  = "grafana.enabled"
    value = "false"
  }
}

resource "helm_release" "argocd" {
  name       = "argocd"
  repository = "argoproj"
  chart      = "argo-cd"
  namespace  = kubernetes_namespace.argocd.metadata[0].name

  create_namespace = true
}

resource "kubernetes_manifest" "argocd_app" {
  manifest = yamldecode(templatefile("${path.module}/argocd-app.yaml.tmpl", {
    repo_url = var.repo_url
  }))
  depends_on = [helm_release.argocd]
}
