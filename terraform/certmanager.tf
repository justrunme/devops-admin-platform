resource "helm_release" "cert_manager" {
  name       = "cert-manager"
  namespace  = "cert-manager"
  repository = "https://charts.jetstack.io"
  chart      = "cert-manager"
  version    = "v1.15.0"

  create_namespace = true

  set = [
    {
      name  = "installCRDs"
      value = "false"
    }
  ]
  depends_on = [null_resource.install_cert_manager_crds]
  wait       = true
  timeout    = 300
}

resource "kubernetes_manifest" "letsencrypt_staging_cluster_issuer" {
  depends_on = [
    helm_release.cert_manager
  ]

  manifest = yamldecode(file("${path.module}/manifests/cluster-issuer-staging.yaml"))
}