all: up

up:
	docker-compose up --build

build:
	docker-compose build

down:
	docker-compose down

deploy-k8s-base:
	kubectl apply -k infra/k8s/base

deploy-k8s-dev:
	kubectl apply -k infra/k8s/overlays/dev

