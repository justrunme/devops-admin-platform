# DevOps Admin Platform

Agent-based admin panel for inventory, metrics, logs, and alerts on Kubernetes.

[![CI](https://github.com/justrunme/devops-admin-platform/actions/workflows/ci.yml/badge.svg)](https://github.com/justrunme/devops-admin-platform/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/justrunme/devops-admin-platform?display_name=tag)](https://github.com/justrunme/devops-admin-platform/releases/latest)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Build and Push Docker Images](https://github.com/justrunme/devops-admin-platform/actions/workflows/docker-build-push.yml/badge.svg)](https://github.com/justrunme/devops-admin-platform/actions/workflows/docker-build-push.yml)
[![Terraform Platform Deployment Test](https://github.com/justrunme/devops-admin-platform/actions/workflows/terraform-deploy.yml/badge.svg)](https://github.com/justrunme/devops-admin-platform/actions/workflows/terraform-deploy.yml)
[![Case study](https://img.shields.io/badge/case-justrunme.com-111111)](https://justrunme.com/cases/developer-platform-interface/)

Case study: [Developer Platform Interface](https://justrunme.com/cases/developer-platform-interface/) · [Andrey Lesnikov](https://justrunme.com/)

## What it does

- Exposes a Next.js admin UI (`/nodes`, `/agents`, `/metrics`, `/alerts`, `/logs`, `/status`) over a Go API
- Collects agent heartbeats (`POST /ping`) with PostgreSQL/Redis backing services
- Deploys platform components with Terraform/Helm and Argo CD against Kind in CI

## Why

- Operators need one place for inventory and signal (metrics, logs, alerts) next to GitOps-managed infra
- Local Compose and Kind paths keep the same API/UI contract testable without a full cloud stack

## Quickstart

```bash
make up
# or: docker compose up --build
# Kubernetes path: make tf-up
```

## Architecture

```mermaid
flowchart LR
  Agent[agent Python /ping] --> API[api Go REST]
  API --> PG[(PostgreSQL)]
  API --> Redis[(Redis)]
  UI[ui Next.js] --> API
  TF[terraform + charts] --> K8s[infra/k8s]
  K8s --> API
  K8s --> UI
  Mon[monitoring Prometheus/Grafana/Loki] --> UI
  CI[.github/workflows/ci.yml] --> Img[docker-build-push.yml]
  CI --> TFci[terraform-deploy.yml]
```

## Features

| Feature | Description |
|---------|-------------|
| Node Inventory | Discovers nodes via agents (hostname, uptime, OS info) |
| Agent Simulation | Python agents sending heartbeats to the Go API (`POST /ping`) |
| Grafana Dashboards | Prometheus metrics via Grafana (kube-prometheus-stack) |
| Loki Logs | Centralized logs with Loki + Grafana |
| Alerts Overview | Prometheus Alertmanager integration in the UI |
| UI (Next.js) | Admin pages: `/nodes`, `/agents`, `/metrics`, `/alerts`, `/logs`, `/status` |
| GitOps | Infra managed with Terraform + Helm; Argo CD Application for `infra/k8s/base` |

---

## Tech Stack

- **Frontend**: Next.js 14 (TypeScript, pages router)
- **Backend**: Go REST API (`/api`)
- **Agent**: Python heartbeat client
- **Database**: PostgreSQL, Redis
- **Monitoring**: Prometheus, Grafana, Loki
- **CI/CD**: GitHub Actions (CI, image build/push, Terraform kind deploy)
- **Kubernetes**: kind (CI) / Minikube / cloud-ready manifests under `infra/k8s`

---

## Getting Started

### Docker Compose (local apps)

```bash
git clone https://github.com/justrunme/devops-admin-platform.git
cd devops-admin-platform
docker compose up --build
```

| Component | URL |
|-----------|-----|
| Admin UI | http://localhost:3000 |
| API | http://localhost:8080 |
| API health | http://localhost:8080/health |
| API status | http://localhost:8080/api/status |

### Terraform on Kubernetes

Requires a working cluster kubeconfig (`kubectl` / kind / Minikube).

```bash
cd terraform
terraform init
terraform apply -var="repo_url=https://github.com/justrunme/devops-admin-platform.git"
```

After deploy (port-forward or ingress as configured):

| Component | Typical local URL |
|-----------|-------------------|
| Admin UI | http://localhost:3000 |
| API | http://localhost:8080 |
| Grafana | http://localhost:3001 (or cluster Ingress host) |
| Argo CD UI | http://localhost:8082 |

Helper targets: `make up`, `make tf-up`.

---

## Repository layout

```
api/          Go API
ui/           Next.js UI
agent/        Python agent
charts/       Helm charts for api/ui/agent
terraform/    Cluster bootstrap (Helm releases + manifests)
infra/k8s/    Kustomize base/overlays (Argo CD source path)
monitoring/   Alert rules
```

---

## Roadmap

- Auth & RBAC (NextAuth.js / Auth0)
- WebSocket-based live metrics
- Full asset database per node
- Istio / OPA zero-trust policies
- Native agent binary (Go or Rust)

---

## Author

Andrey Lesnikov  
Senior DevOps / Platform Engineer  
https://justrunme.com/

---

## License

MIT — see [LICENSE](LICENSE).
