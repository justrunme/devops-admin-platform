resource "helm_release" "kube_prometheus" {
  name       = "monitoring"
  namespace  = kubernetes_namespace.monitoring.metadata[0].name
  repository = "https://prometheus-community.github.io/helm-charts"
  chart      = "kube-prometheus-stack"
  version    = "92.3.0"
  timeout    = 900
  wait       = true
  depends_on = [helm_release.cert_manager]

  set = [
    {
      name  = "grafana.adminPassword"
      value = "admin123"
    },
    {
      name  = "grafana.ingress.enabled"
      value = "false"
    },
    {
      name  = "prometheus.ingress.enabled"
      value = "false"
    },
    {
      name  = "prometheus.prometheusSpec.resources.requests.memory"
      value = "256Mi"
    },
    {
      name  = "prometheus.prometheusSpec.resources.requests.cpu"
      value = "100m"
    },
    {
      name  = "alertmanager.enabled"
      value = "true"
    },
    {
      name  = "kubeEtcd.enabled"
      value = "false"
    },
    {
      name  = "kubeControllerManager.enabled"
      value = "false"
    },
    {
      name  = "kubeScheduler.enabled"
      value = "false"
    }
  ]
}

resource "helm_release" "loki" {
  name       = "loki"
  namespace  = kubernetes_namespace.monitoring.metadata[0].name
  repository = "https://grafana.github.io/helm-charts"
  chart      = "loki-stack"
  version    = "2.10.3"
  timeout    = 600
  wait       = true

  set = [
    {
      name  = "grafana.enabled"
      value = "false"
    },
    {
      name  = "prometheus.enabled"
      value = "false"
    },
    {
      name  = "loki.persistence.enabled"
      value = "false"
    }
  ]
}
