resource "helm_release" "postgresql" {
  name             = "postgres"
  namespace        = "default"
  repository       = "oci://registry-1.docker.io/bitnamicharts"
  chart            = "postgresql"
  version          = "18.12.4"
  create_namespace = false
  timeout          = 600
  wait             = true
  atomic           = true
  cleanup_on_fail  = true

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
      name  = "primary.persistence.enabled"
      value = "false"
    },
    {
      name  = "primary.resources.requests.cpu"
      value = "50m"
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
  name             = "redis"
  repository       = "oci://registry-1.docker.io/bitnamicharts"
  chart            = "redis"
  version          = "28.3.1"
  namespace        = "default"
  timeout          = 600
  wait             = true
  atomic           = true
  cleanup_on_fail  = true

  set = [
    {
      name  = "architecture"
      value = "standalone"
    },
    {
      name  = "auth.password"
      value = "supersecurepassword"
    },
    {
      name  = "master.persistence.enabled"
      value = "false"
    },
    {
      name  = "replica.replicaCount"
      value = "0"
    },
    {
      name  = "master.resources.requests.cpu"
      value = "50m"
    },
    {
      name  = "master.resources.requests.memory"
      value = "64Mi"
    }
  ]
}

resource "helm_release" "api" {
  name            = "api"
  chart           = "../charts/api"
  namespace       = "default"
  values          = [file("../charts/api/values.yaml")]
  depends_on      = [helm_release.redis, kubernetes_service_account.api, helm_release.postgresql, helm_release.ingress_nginx]
  timeout         = 900
  atomic          = true
  cleanup_on_fail = true
  wait            = true

  set = [
    {
      name  = "database.url"
      value = "postgres://app:secret@postgres-service:5432/app?sslmode=disable"
    },
    {
      name  = "redis.url"
      value = "redis://:supersecurepassword@redis-master:6379"
    },
    {
      name  = "serviceAccount.create"
      value = "false"
    },
    {
      name  = "serviceAccount.name"
      value = kubernetes_service_account.api.metadata[0].name
    },
    {
      name  = "ingress.enabled"
      value = "false"
    }
  ]
}

resource "helm_release" "ui" {
  name       = "ui"
  chart      = "../charts/ui"
  namespace  = "default"
  values     = [file("../charts/ui/values.yaml")]
  depends_on = [helm_release.api, helm_release.ingress_nginx]
  timeout    = 600
  wait       = true

  set = [
    {
      name  = "ingress.enabled"
      value = "false"
    }
  ]
}

resource "helm_release" "agent" {
  name       = "agent"
  chart      = "../charts/agent"
  namespace  = "default"
  values     = [file("../charts/agent/values.yaml")]
  depends_on = [helm_release.api]
  timeout    = 600
  wait       = true
}
