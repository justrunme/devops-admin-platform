resource "helm_release" "redis" {
  name       = "redis"
  repository = "https://charts.bitnami.com/bitnami"
  chart      = "redis"
  version    = "17.3.5"
  namespace  = "default"
}

resource "helm_release" "api" {
  name       = "api"
  chart      = "./../charts/api"
  namespace  = "default"
  values     = [file("./../charts/api/values.yaml")]
  depends_on = [helm_release.redis]
}
