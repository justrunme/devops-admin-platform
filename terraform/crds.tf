resource "null_resource" "install_cert_manager_crds" {
  provisioner "local-exec" {
    command     = "kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.21.2/cert-manager.crds.yaml"
    interpreter = ["/bin/bash", "-c"]
  }

  triggers = {
    always_run = timestamp()
  }
}

resource "null_resource" "install_argocd_crds" {
  provisioner "local-exec" {
    command = <<-EOT
      kubectl apply -f https://raw.githubusercontent.com/argoproj/argo-cd/v3.5.4/manifests/crds/application-crd.yaml
      kubectl apply -f https://raw.githubusercontent.com/argoproj/argo-cd/v3.5.4/manifests/crds/appproject-crd.yaml
      kubectl apply -f https://raw.githubusercontent.com/argoproj/argo-cd/v3.5.4/manifests/crds/applicationset-crd.yaml
    EOT
    interpreter = ["/bin/bash", "-c"]
  }

  triggers = {
    always_run = timestamp()
  }
}
