resource "null_resource" "install_cert_manager_crds" {
  provisioner "local-exec" {
    command = "kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.15.0/cert-manager.crds.yaml"
    interpreter = ["/bin/bash", "-c"]
  }

  triggers = {
    always_run = timestamp()
  }
}

resource "null_resource" "install_argocd_crds" {
  provisioner "local-exec" {
    command = "kubectl apply -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/crds/application-crd.yaml"
    interpreter = ["/bin/bash", "-c"]
  }

  triggers = {
    always_run = timestamp()
  }
}
