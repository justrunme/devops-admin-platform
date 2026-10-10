resource "helm_release" "kube_prometheus" {
  name             = "monitoring"
  namespace        = kubernetes_namespace.monitoring.metadata[0].name
  repository       = "https://prometheus-community.github.io/helm-charts"
  chart            = "kube-prometheus-stack"
  version          = "92.3.0"
  timeout          = 1200
  wait             = true
  atomic           = false
  cleanup_on_fail  = false
  depends_on       = [helm_release.cert_manager]

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
      name  = "alertmanager.enabled"
      value = "false"
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
    },
    {
      name  = "kubeProxy.enabled"
      value = "false"
    },
    {
      name  = "nodeExporter.enabled"
      value = "false"
    },
    {
      name  = "prometheus.prometheusSpec.retention"
      value = "1h"
    },
    {
      name  = "prometheus.prometheusSpec.resources.requests.cpu"
      value = "100m"
    },
    {
      name  = "prometheus.prometheusSpec.resources.requests.memory"
      value = "256Mi"
    },
    {
      name  = "prometheus.prometheusSpec.resources.limits.memory"
      value = "512Mi"
    },
    {
      name  = "prometheusOperator.resources.requests.cpu"
      value = "50m"
    },
    {
      name  = "prometheusOperator.resources.requests.memory"
      value = "64Mi"
    },
    {
      name  = "grafana.resources.requests.cpu"
      value = "50m"
    },
    {
      name  = "grafana.resources.requests.memory"
      value = "64Mi"
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
  depends_on = [helm_release.kube_prometheus]

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
    },
    {
      name  = "promtail.enabled"
      value = "true"
    }
  ]
}
