resource "helm_release" "redis" {
  name       = "redis"
  repository = "https://charts.bitnami.com/bitnami"
  chart      = "redis"
  version    = "17.3.5"
  namespace  = "default"

  set = [
    {
      name  = "auth.password"
      value = "supersecurepassword"
    },
    {
      name  = "master.persistence.enabled"
      value = "false"
    },
    {
      name  = "replica.persistence.enabled"
      value = "false"
    },
    {
      name  = "readinessProbe.initialDelaySeconds"
      value = "30"
    },
    {
      name  = "readinessProbe.periodSeconds"
      value = "10"
    }
  ]
}

resource "helm_release" "api" {
  name       = "api"
  chart      = "../charts/api"
  namespace  = "default"
  values     = [file("../charts/api/values.yaml")]
  depends_on = [helm_release.redis]
}

resource "helm_release" "ui" {
  name       = "ui"
  chart      = "../charts/ui"
  namespace  = "default"
  values     = [file("../charts/ui/values.yaml")]
  depends_on = [helm_release.api]
}

resource "helm_release" "agent" {
  name       = "agent"
  chart      = "../charts/agent"
  namespace  = "default"
  values     = [file("../charts/agent/values.yaml")]
  depends_on = [helm_release.api]
}