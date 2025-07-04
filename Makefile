all: up

up:
	docker-compose up --build

build:
	docker-compose build

down:
	docker-compose down

tf-apply-crds:
	cd terraform && terraform init && terraform apply -auto-approve -var="repo_url=https://github.com/justrunme/devops-admin-platform.git" -target=null_resource.install_cert_manager_crds -target=null_resource.install_argocd_crds

tf-apply-helm:
	cd terraform && terraform apply -auto-approve -var="repo_url=https://github.com/justrunme/devops-admin-platform.git" -target=helm_release.cert_manager -target=helm_release.argocd -target=helm_release.ingress_nginx -target=helm_release.redis -target=helm_release.api -target=helm_release.ui -target=helm_release.agent -target=helm_release.kube_prometheus -target=helm_release.loki

tf-apply-manifests:
	cd terraform && terraform apply -auto-approve -var="repo_url=https://github.com/justrunme/devops-admin-platform.git" -target=kubernetes_manifest.letsencrypt_staging_cluster_issuer -target=kubernetes_manifest.argocd_app

tf-up: tf-apply-crds tf-apply-helm tf-apply-manifests

