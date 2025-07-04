all: up

up:
	docker-compose up --build

build:
	docker-compose build

down:
	docker-compose down

pre-crds:
	kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.15.0/cert-manager.crds.yaml
	kubectl apply -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/crds/application-crd.yaml

tf-up: pre-crds
	cd terraform && terraform init && terraform apply -auto-approve -var="repo_url=https://github.com/justrunme/devops-admin-platform.git" # Replace with your actual repo URL