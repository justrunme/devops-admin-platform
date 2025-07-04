# DevOps Admin Platform

[![CI/CD Status](https://github.com/justrunme/devops-admin-platform/actions/workflows/ci-cd.yaml/badge.svg)](https://github.com/justrunme/devops-admin-platform/actions/workflows/ci-cd.yaml)

## Project Description

**DevOps Admin Platform** is a comprehensive, Kubernetes-ready system for infrastructure management, designed as an alternative to solutions like Tactical RMM and FleetDM. The project demonstrates deep expertise in DevOps, including modern practices of CI/CD, GitOps, monitoring, logging, and security. It is ideal for showcasing on GitHub as well as for use in real-world projects.

## Key Features

-   **Unified Control Panel**: Next.js UI for centralized infrastructure management.
-   **High-Performance API**: Go backend for efficient interaction with system components.
-   **Agent System**: Simple agents (Python) to simulate connected devices and collect data.
-   **Full CI/CD Cycle**: Automated build, testing, and deployment of applications using GitHub Actions.
-   **GitOps with ArgoCD**: Declarative infrastructure and application management, ensuring automatic synchronization of cluster state with the Git repository.
-   **Comprehensive Monitoring**: Prometheus for metric collection, Grafana for data visualization, and Loki for centralized logging.
-   **Security**: Integration with Trivy and Kyverno (planned) for vulnerability scanning and security policy enforcement.
-   **Automatic TLS**: Using cert-manager for automatic acquisition and renewal of SSL/TLS certificates.

## Chosen Stack

| Component             | Technology             | Justification                                      |
| :-------------------- | :--------------------- | :----------------------------------------------- |
| **UI**                | Next.js (React)        | Fast, SSR, scalable                               |
| **API**               | Go (Golang)            | Lightweight, fast, suitable for production API     |
| **Database**          | PostgreSQL             | Reliable and extensible                           |
| **Cache**             | Redis                  | Instant access, pub/sub                           |
| **Kubernetes Mgmt**   | Kustomize              | Flexible and reusable manifests                   |
| **CI/CD**             | GitHub Actions         | Popular, easily integrated                        |
| **GitOps**            | ArgoCD                 | Convenient visualization and state control        |
| **Monitoring**        | Prometheus + Grafana   | De-facto standard in Kubernetes                   |
| **Logging**           | Loki                   | Fast and native with Grafana                      |
| **Security**          | Trivy + Kyverno        | Vulnerability scanning + security policy (plan)   |
| **TLS/Ingress**       | NGINX + cert-manager   | Automatic HTTPS, simple ingress                   |

## Project Structure

```
devops-admin-platform/
│
├── api/                            # Golang API
│   ├── Dockerfile
│   ├── go.mod / go.sum
│   └── main.go
│
├── ui/                             # Next.js UI
│   ├── Dockerfile
│   ├── package.json
│   ├── next.config.js
│   └── pages/
│
├── agent/                          # Agent script (client emulation)
│   ├── Dockerfile
│   └── agent.py
│
├── infra/                          # Infrastructure
│   ├── k8s/                        # K8s manifests (Kustomize)
│   │   ├── base/                   # Base manifests
│   │   │   ├── api/                # API Deployment & Service
│   │   │   ├── ui/                 # UI Deployment & Service
│   │   │   ├── agent/              # Agent Deployment
│   │   │   ├── postgres/           # PostgreSQL Deployment, Service, PVC
│   │   │   ├── redis/              # Redis Deployment & Service
│   │   │   ├── ingress.yaml        # Ingress for UI/API
│   │   │   ├── secrets.yaml        # Application secrets
│   │   │   ├── cluster-issuer.yaml # Cert-manager ClusterIssuer
│   │   │   ├── argocd-ingress.yaml # Ingress for ArgoCD UI
│   │   │   ├── argocd-app.yaml     # ArgoCD Application definition
│   │   │   └── kustomization.yaml  # Kustomize base
│   │   └── overlays/              # dev / staging / prod environments (plan)
│   │       ├── dev/
│   │       └── prod/
│
├── .github/
│   └── workflows/
│       └── ci-cd.yaml             # CI/CD pipeline (GitHub Actions)
│
├── scripts/
│   ├── deploy.sh                  # Minikube deployment (deprecated, now GitOps)
│   └── smoke-test.sh              # Post-deployment verification
│
├── manifests/                     # Manifests for third-party services (Prometheus, Grafana, Loki, ArgoCD)
│   ├── prometheus/                # (Installed via Helm)
│   ├── grafana/                   # (Installed via Helm)
│   ├── loki/                      # (Installed via Helm)
│   └── argocd/                    # (Installed via Helm)
│
├── README.md                      # Project documentation
├── architecture.md                # Architectural description
├── docker-compose.yaml            # Local run without K8s (dev-mode)
└── Makefile                       # Commands for running, building, and deploying
```

## How to Deploy

### Local Development (Docker Compose)

For quick local development and testing of all components without Kubernetes:

1.  **Install Docker and Docker Compose.**
2.  **Navigate to the project root directory:**
    ```bash
    cd devops-admin-platform
    ```
3.  **Start all services:**
    ```bash
    docker compose up --build
    ```
    This will build images and start the UI, API, PostgreSQL, Redis, and Agent.
4.  **Access Services:**
    *   **UI**: `http://localhost:3000`
    *   **API**: `http://localhost:8080` (for health check `http://localhost:8080/health`)

### Deployment in Kubernetes (Minikube/Kind + GitOps)

For full-fledged deployment using GitOps and all components:

1.  **Install `kubectl`, `minikube` (or `kind`), and `helm`.**

2.  **Start Minikube (if using):**
    ```bash
    minikube start
    ```

3.  **Enable Ingress addon in Minikube:**
    ```bash
    minikube addons enable ingress
    ```

4.  **Install cert-manager:**
    ```bash
    kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.15.0/cert-manager.yaml
    ```
    Wait for `cert-manager` pods to start (`kubectl get pods -n cert-manager`).

5.  **Add Helm repositories:**
    ```bash
    helm repo add grafana https://grafana.github.io/helm-charts
    helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
    helm repo update
    ```

6.  **Install Prometheus and Grafana:**
    ```bash
    helm install monitoring prometheus-community/kube-prometheus-stack \
      --namespace monitoring --create-namespace \
      --set grafana.ingress.enabled=true \
      --set grafana.ingress.annotations."cert-manager\.io/cluster-issuer"=letsencrypt-staging \
      --set grafana.ingress.hosts[0]=grafana.devops.local \
      --set grafana.ingress.tls[0].hosts[0]=grafana.devops.local \
      --set grafana.ingress.tls[0].secretName=grafana-tls \
      --set grafana.adminPassword=admin123
    ```

7.  **Install Loki and Promtail:**
    ```bash
    helm install loki grafana/loki-stack \
      --namespace monitoring \
      --set grafana.enabled=false
    ```

8.  **Install ArgoCD:**
    ```bash
    kubectl create namespace argocd
    kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
    ```
    Wait for `argocd` pods to start (`kubectl get pods -n argocd`).

9.  **Configure GitHub Container Registry (GHCR) and GitHub Secrets:**
    *   In your GitHub repository (`Settings` -> `Actions` -> `General`), enable `Read and write permissions` for `Workflow permissions`.
    *   Create a Personal Access Token (PAT) with `write:packages`, `read:packages`, `workflow`, and `repo` permissions.
    *   Add the following secrets to your repository (`Settings` -> `Secrets and variables` -> `Actions` -> `New repository secret`):
        *   `GHCR_USERNAME`: Your GitHub username.
        *   `GHCR_TOKEN`: Your created PAT.

10. **Update `infra/k8s/base/argocd-app.yaml`:**
    Replace `YOUR_USERNAME` and `YOUR_REPO` with your actual GitHub repository details.

11. **Apply base application manifests (including ArgoCD Application and Ingresses):**
    ```bash
    kubectl apply -k infra/k8s/base
    ```

12. **Add entries to your `/etc/hosts` file:**
    ```
    127.0.0.1 devops.local
    127.0.0.1 grafana.devops.local
    127.0.0.1 argocd.devops.local
    127.0.0.1 prometheus.devops.local
    ```

13. **Run `minikube tunnel` (if using Minikube) in a separate terminal:**
    ```bash
    minikube tunnel
    ```
    This is necessary for Ingress to work.

## How to Use

### Access UI/API

After deployment in Kubernetes, the UI and API are accessible via HTTPS:

*   **UI**: `https://devops.local`
*   **API Health Check**: `https://devops.local/api/health`

### Access Grafana

*   **URL**: `https://grafana.devops.local`
*   **Login**: `admin`
*   **Password**: `admin123` (or the one you specified during installation)

### Access ArgoCD

*   **URL**: `https://argocd.devops.local`
*   **Login**: `admin`
*   **Password**: Get the password using the command:
    ```bash
    kubectl get secret argocd-initial-admin-secret -n argocd -o jsonpath="{.data.password}" | base64 -d
    ```

### Monitoring and Logging

In Grafana, you can:

*   **View Metrics**: Use the `Prometheus` data source and import dashboards (e.g., ID `1860` for Kubernetes Cluster Monitoring, `6417` for Node Exporter Full).
*   **Analyze Logs**: Use the `Loki` data source in the `Explore` section. Example queries:
    *   API logs: `{app="api"}`
    *   Agent logs: `{app="agent"}`

## Architecture Diagram

(To be added, possibly using Mermaid or other visualization tools for architecture)

## CI/CD Flow (GitHub Actions + GitOps)

The project uses a fully automated CI/CD pipeline based on GitHub Actions and GitOps with ArgoCD:

1.  **Developer pushes code** to the `main` branch.
2.  **GitHub Actions runs the `ci-cd.yaml` workflow:**
    *   Builds Docker images for UI, API, and Agent.
    *   Pushes the built images to GitHub Container Registry (GHCR).
    *   Updates image tags in `infra/k8s/base/kustomization.yaml` to the current `git commit SHA`.
    *   Performs a `git commit` and `git push` of the updated `kustomization.yaml` back to the repository.
3.  **ArgoCD monitors changes** in the Git repository.
4.  **ArgoCD automatically synchronizes** and deploys new application versions to Kubernetes, ensuring the desired cluster state.

This ensures a fully automated and declarative deployment process, minimizing manual operations and errors.

## Example Commands

*   **Run locally**: `docker compose up --build`
*   **Apply Kustomize manifests**: `kubectl apply -k infra/k8s/base`
*   **Get ArgoCD password**: `kubectl get secret argocd-initial-admin-secret -n argocd -o jsonpath="{.data.password}" | base64 -d`
*   **Port-forward UI (for debugging)**: `kubectl port-forward svc/ui-service 3000:3000`
*   **Check pods**: `kubectl get pods -A`
