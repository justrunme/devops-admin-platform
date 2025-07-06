resource "helm_release" "kube_prometheus" {
  name       = "monitoring"
  namespace  = kubernetes_namespace.monitoring.metadata[0].name
  repository = "prometheus-community"
  chart      = "kube-prometheus-stack"

  set = [
    {
      name  = "grafana.adminPassword"
      value = "admin123"
    },
    {
      name  = "grafana.ingress.enabled"
      value = "true"
    },
    {
      name  = "grafana.ingress.annotations.\"cert-manager\\.io/cluster-issuer\""
      value = "letsencrypt-staging"
    },
    {
      name  = "grafana.ingress.hosts[0]"
      value = "grafana.devops.local"
    },
    {
      name  = "grafana.ingress.tls[0].hosts[0]"
      value = "grafana.devops.local"
    },
    {
      name  = "grafana.ingress.tls[0].secretName"
      value = "grafana-tls"
    },
    {
      name  = "prometheus.ingress.enabled"
      value = "true"
    },
    {
      name  = "prometheus.ingress.hosts[0]"
      value = "prometheus.localhost"
    }
  ]

  depends_on = [helm_release.cert_manager]
}

resource "helm_release" "loki" {
  name       = "loki"
  namespace  = kubernetes_namespace.monitoring.metadata[0].name
  repository = "grafana"
  chart      = "loki-stack"

  set = [
    {
      name  = "grafana.enabled"
      value = "false"
    }
  ]
}

