

resource "helm_release" "postgresql" {
  name       = "postgres"
  namespace  = "default"
  repository = "https://charts.bitnami.com/bitnami"
  chart      = "postgresql"
  version    = "15.5.1"

  set = [
    {
      name  = "auth.username"
      value = "app"
    },
    {
      name  = "auth.password"
      value = "secret"
    },
    {
      name  = "auth.database"
      value = "app"
    },
    {
      name  = "fullnameOverride"
      value = "postgres-service"
    },
    {
      name  = "primary.resources.requests.cpu"
      value = "100m"
    },
    {
      name  = "primary.resources.requests.memory"
      value = "128Mi"
    },
    {
      name  = "primary.resources.limits.cpu"
      value = "250m"
    },
    {
      name  = "primary.resources.limits.memory"
      value = "256Mi"
    }
  ]
}

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
  depends_on = [helm_release.redis, kubernetes_service_account.api, helm_release.postgresql]
  timeout    = 900
  atomic     = true
  cleanup_on_fail = true

  set = [
    {
      name  = "database.url"
      value = "postgres://app:secret@postgres-service:5432/app?sslmode=disable"
    },
    {
      name  = "serviceAccount.create"
      value = "false"
    },
    {
      name  = "serviceAccount.name"
      value = kubernetes_service_account.api.metadata[0].name
    }
  ]
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