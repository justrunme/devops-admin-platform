resource "helm_release" "ingress_nginx" {
  name             = "ingress-nginx"
  namespace        = "ingress-nginx"
  repository       = "https://kubernetes.github.io/ingress-nginx"
  chart            = "ingress-nginx"
  version          = "4.15.1"
  create_namespace = true
  wait             = true
  timeout          = 300

  set = [
    {
      name  = "controller.service.type"
      value = "NodePort"
    },
    {
      name  = "controller.resources.requests.cpu"
      value = "50m"
    },
    {
      name  = "controller.resources.requests.memory"
      value = "64Mi"
    }
  ]
}
