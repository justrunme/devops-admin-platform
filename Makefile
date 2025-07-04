all: up

up:
	docker-compose up --build

build:
	docker-compose build

down:
	docker-compose down

tf-up:
	cd terraform && terraform init && terraform apply -auto-approve