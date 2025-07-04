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
      value = "true"
    }
  ]
}

resource "null_resource" "wait_for_cert_manager_crds" {
  depends_on = [helm_release.cert_manager]

  provisioner "local-exec" {
    command = <<EOT
      echo "⏳ Waiting for ClusterIssuer CRD to become discoverable..."

      for i in {1..60}; do
        kubectl api-resources | grep -q "clusterissuers.cert-manager.io" && break
        echo "⏳ Waiting... ($i)"
        sleep 5
      done

      if ! kubectl api-resources | grep -q "clusterissuers.cert-manager.io"; then
        echo "❌ Timeout waiting for ClusterIssuer CRD"
        exit 1
      fi

      echo "✅ ClusterIssuer CRD is available to Terraform"
EOT
    interpreter = ["/bin/bash", "-c"]
  }
}

resource "kubernetes_manifest" "letsencrypt_staging_cluster_issuer" {
  depends_on = [null_resource.wait_for_cert_manager_crds]

  manifest = yamldecode(file("${path.module}/manifests/cluster-issuer-staging.yaml"))
}