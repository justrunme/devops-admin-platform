# ️ DevOps Admin Panel — Zero-Trust Monitoring Platform

[![Build and Push Docker Images](https://github.com/justrunme/devops-admin-platform/actions/workflows/docker-build-push.yml/badge.svg)](https://github.com/justrunme/devops-admin-platform/actions/workflows/docker-build-push.yml)

A **production-grade DevOps admin panel** inspired by FleetDM and TacticalRMM.  
Includes agent-based inventory, metrics dashboards, logs, alerts, and full GitOps automation.

---

##  Features

| Feature                | Description                                                           |
|------------------------|-----------------------------------------------------------------------|
|  Node Inventory       | Automatically discovers nodes with agents (hostname, uptime, OS info) |
|  Agent Simulation     | Fake agents sending data to backend API                               |
|  Grafana Dashboards   | Integrated Prometheus metrics (CPU, RAM, Load, etc.) via Grafana       |
|  Loki Logs            | Centralized log viewing using Loki + Grafana                          |
|  Alerts Overview      | Prometheus Alertmanager integration                                   |
|  UI (Next.js)         | Admin interface with pages like /nodes, /metrics, /alerts, /status     |
|  Zero-Trust Friendly  | Can be extended with OPA/Istio/Security Policies                      |
| ☸️ GitOps Powered       | Full infra managed with Terraform + Helm in Kubernetes                |

---

## ⚙️ Tech Stack

- **Frontend**: Next.js (TypeScript)
- **Backend**: Go (REST API), Node.js (agent simulation)
- **Database**: PostgreSQL, Redis
- **Monitoring**: Prometheus, Grafana, Loki
- **CI/CD**: GitHub Actions + GitOps
- **Kubernetes**: Minikube / Kind / Cloud-Ready

---

##  Getting Started

```bash
# Clone the repository
git clone https://github.com/justrunme/devops-admin-platform.git
cd devops-admin-platform

# Deploy the full platform to Kubernetes
terraform init
terraform apply

Once deployed, access your platform via:

| Component   | URL                               |
|-------------|-----------------------------------|
| Admin UI    | http://localhost:3000             |
| Grafana     | http://localhost:3000/grafana     |
| Loki Logs   | http://localhost:3000/grafana     |
| ArgoCD UI   | http://localhost:8082             |


---

 Screenshots

Coming soon:
•Node Inventory Page
•Real-time Metrics
•Logs Dashboard
•Alerts View

---

 Roadmap
•Auth & RBAC (NextAuth.js / Auth0)
•WebSocket-based live metrics
•Full asset database per node
•Istio / OPA Zero Trust
•Real agent binary in Rust or Go

---

 Author

Andrey Just
Senior DevOps / Platform Engineer
 justrunme.dev

---

 License

MIT
