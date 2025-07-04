# DevOps Admin Platform

[![CI/CD Status](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/ci-cd.yaml/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/ci-cd.yaml)

## Описание проекта

**DevOps Admin Platform** — это комплексная, Kubernetes-ready система для управления инфраструктурой, разработанная как аналог таких решений, как Tactical RMM и FleetDM. Проект демонстрирует глубокую экспертизу в области DevOps, включая современные практики CI/CD, GitOps, мониторинга, логирования и безопасности. Идеально подходит как для демонстрации на GitHub, так и для использования в реальных проектах.

## Ключевые особенности

-   **Единая панель управления**: UI на Next.js для централизованного управления инфраструктурой.
-   **Высокопроизводительный API**: Backend на Go для эффективного взаимодействия с компонентами системы.
-   **Агентская система**: Простые агенты (Python) для имитации подключенных устройств и сбора данных.
-   **Полный цикл CI/CD**: Автоматизированная сборка, тестирование и доставка приложений с использованием GitHub Actions.
-   **GitOps с ArgoCD**: Декларативное управление инфраструктурой и приложениями, обеспечивающее автоматическую синхронизацию состояния кластера с Git-репозиторием.
-   **Комплексный мониторинг**: Prometheus для сбора метрик, Grafana для визуализации данных и Loki для централизованного логирования.
-   **Безопасность**: Интеграция с Trivy и Kyverno (планируется) для сканирования уязвимостей и применения политик безопасности.
-   **Автоматический TLS**: Использование cert-manager для автоматического получения и обновления SSL/TLS сертификатов.

## Выбранный стек

| Компонент             | Технология             | Обоснование                                      |
| :-------------------- | :--------------------- | :----------------------------------------------- |
| **UI**                | Next.js (React)        | Быстро, SSR, масштабируемо                       |
| **API**               | Go (Golang)            | Лёгкий, быстрый, подходит для production API     |
| **База данных**       | PostgreSQL             | Надёжная и расширяемая                           |
| **Кеш**               | Redis                  | Мгновенный доступ, pub/sub                       |
| **Kubernetes Mgmt**   | Kustomize              | Гибкость и переиспользуемость манифестов         |
| **CI/CD**             | GitHub Actions         | Популярный, легко интегрируется                  |
| **GitOps**            | ArgoCD                 | Удобная визуализация и контроль состояния        |
| **Мониторинг**        | Prometheus + Grafana   | Де-факто стандарт в Kubernetes                   |
| **Логирование**       | Loki                   | Быстро и нативно с Grafana                       |
| **Безопасность**      | Trivy + Kyverno        | Скан уязвимостей + политика безопасности (план)  |
| **TLS/Ingress**       | NGINX + cert-manager   | Автоматический HTTPS, простой ingress            |

## Структура проекта

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
├── agent/                          # Скрипт-агент (эмуляция клиентов)
│   ├── Dockerfile
│   └── agent.py
│
├── infra/                          # Инфраструктура
│   ├── k8s/                        # K8s манифесты (Kustomize)
│   │   ├── base/                   # Базовые манифесты
│   │   │   ├── api/                # API Deployment & Service
│   │   │   ├── ui/                 # UI Deployment & Service
│   │   │   ├── agent/              # Agent Deployment
│   │   │   ├── postgres/           # PostgreSQL Deployment, Service, PVC
│   │   │   ├── redis/              # Redis Deployment & Service
│   │   │   ├── ingress.yaml        # Ingress для UI/API
│   │   │   ├── secrets.yaml        # Секреты приложения
│   │   │   ├── cluster-issuer.yaml # Cert-manager ClusterIssuer
│   │   │   ├── argocd-ingress.yaml # Ingress для ArgoCD UI
│   │   │   ├── argocd-app.yaml     # ArgoCD Application definition
│   │   │   └── kustomization.yaml  # Kustomize base
│   │   └── overlays/              # dev / staging / prod окружения (план)
│   │       ├── dev/
│   │       └── prod/
│
├── .github/
│   └── workflows/
│       └── ci-cd.yaml             # CI/CD пайплайн (GitHub Actions)
│
├── scripts/
│   ├── deploy.sh                  # Установка на Minikube (устарело, теперь GitOps)
│   └── smoke-test.sh              # Проверка после деплоя
│
├── manifests/                     # Манифесты для сторонних сервисов (Prometheus, Grafana, Loki, ArgoCD)
│   ├── prometheus/                # (Устанавливается через Helm)
│   ├── grafana/                   # (Устанавливается через Helm)
│   ├── loki/                      # (Устанавливается через Helm)
│   └── argocd/                    # (Устанавливается через Helm)
│
├── README.md                      # Документация проекта
├── architecture.md                # Архитектурное описание
├── docker-compose.yaml            # Локальный запуск без K8s (dev-режим)
└── Makefile                       # Команды для запуска, сборки и деплоя
```

## Как развернуть

### Локальная разработка (Docker Compose)

Для быстрой локальной разработки и тестирования всех компонентов без Kubernetes:

1.  **Установите Docker и Docker Compose.**
2.  **Перейдите в корневую директорию проекта:**
    ```bash
    cd devops-admin-platform
    ```
3.  **Запустите все сервисы:**
    ```bash
    docker compose up --build
    ```
    Это соберет образы, запустит UI, API, PostgreSQL, Redis и Agent.
4.  **Доступ к сервисам:**
    *   **UI**: `http://localhost:3000`
    *   **API**: `http://localhost:8080` (для проверки `http://localhost:8080/health`)

### Развертывание в Kubernetes (Minikube/Kind + GitOps)

Для полноценного развертывания с использованием GitOps и всех компонентов:

1.  **Установите `kubectl`, `minikube` (или `kind`) и `helm`.**

2.  **Запустите Minikube (если используете):**
    ```bash
    minikube start
    ```

3.  **Включите Ingress addon в Minikube:**
    ```bash
    minikube addons enable ingress
    ```

4.  **Установите cert-manager:**
    ```bash
    kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.15.0/cert-manager.yaml
    ```
    Подождите, пока поды `cert-manager` запустятся (`kubectl get pods -n cert-manager`).

5.  **Добавьте Helm репозитории:**
    ```bash
    helm repo add grafana https://grafana.github.io/helm-charts
    helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
    helm repo update
    ```

6.  **Установите Prometheus и Grafana:**
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

7.  **Установите Loki и Promtail:**
    ```bash
    helm install loki grafana/loki-stack \
      --namespace monitoring \
      --set grafana.enabled=false
    ```

8.  **Установите ArgoCD:**
    ```bash
    kubectl create namespace argocd
    kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
    ```
    Подождите, пока поды `argocd` запустятся (`kubectl get pods -n argocd`).

9.  **Настройте GitHub Container Registry (GHCR) и GitHub Secrets:**
    *   В вашем GitHub репозитории (`Settings` -> `Actions` -> `General`) включите `Read and write permissions` для `Workflow permissions`.
    *   Создайте Personal Access Token (PAT) с разрешениями `write:packages`, `read:packages`, `workflow` и `repo`.
    *   Добавьте следующие секреты в ваш репозиторий (`Settings` -> `Secrets and variables` -> `Actions` -> `New repository secret`):
        *   `GHCR_USERNAME`: Ваш GitHub username.
        *   `GHCR_TOKEN`: Ваш созданный PAT.

10. **Обновите `infra/k8s/base/argocd-app.yaml`:**
    Замените `YOUR_USERNAME` и `YOUR_REPO` на актуальные данные вашего GitHub репозитория.

11. **Примените базовые манифесты приложения (включая ArgoCD Application и Ingresses):**
    ```bash
    kubectl apply -k infra/k8s/base
    ```

12. **Добавьте записи в ваш `/etc/hosts` файл:**
    ```
    127.0.0.1 devops.local
    127.0.0.1 grafana.devops.local
    127.0.0.1 argocd.devops.local
    127.0.0.1 prometheus.devops.local
    ```

13. **Запустите `minikube tunnel` (если используете Minikube) в отдельном терминале:**
    ```bash
    minikube tunnel
    ```
    Это необходимо для работы Ingress.

## Как пользоваться

### Доступ к UI/API

После развертывания в Kubernetes, UI и API доступны по HTTPS:

*   **UI**: `https://devops.local`
*   **API Health Check**: `https://devops.local/api/health`

### Доступ к Grafana

*   **URL**: `https://grafana.devops.local`
*   **Логин**: `admin`
*   **Пароль**: `admin123` (или тот, что вы указали при установке)

### Доступ к ArgoCD

*   **URL**: `https://argocd.devops.local`
*   **Логин**: `admin`
*   **Пароль**: Получите пароль командой:
    ```bash
    kubectl get secret argocd-initial-admin-secret -n argocd -o jsonpath="{.data.password}" | base64 -d
    ```

### Мониторинг и логирование

В Grafana вы можете:

*   **Просматривать метрики**: Используйте источник данных `Prometheus` и импортируйте дашборды (например, ID `1860` для Kubernetes Cluster Monitoring, `6417` для Node Exporter Full).
*   **Анализировать логи**: Используйте источник данных `Loki` в разделе `Explore`. Примеры запросов:
    *   Логи API: `{app="api"}`
    *   Логи агентов: `{app="agent"}`

## Диаграмма архитектуры

(Будет добавлено, возможно, с использованием Mermaid или других инструментов для визуализации архитектуры)

## CI/CD схема (GitHub Actions + GitOps)

Проект использует полностью автоматизированный CI/CD пайплайн на базе GitHub Actions и GitOps с ArgoCD:

1.  **Разработчик пушит код** в ветку `main`.
2.  **GitHub Actions запускает workflow `ci-cd.yaml`:**
    *   Собирает Docker-образы для UI, API и Agent.
    *   Пушит собранные образы в GitHub Container Registry (GHCR).
    *   Обновляет теги образов в `infra/k8s/base/kustomization.yaml` на текущий `git commit SHA`.
    *   Делает `git commit` и `git push` обновленного `kustomization.yaml` обратно в репозиторий.
3.  **ArgoCD отслеживает изменения** в Git-репозитории.
4.  **ArgoCD автоматически синхронизирует** и развертывает новые версии приложений в Kubernetes, обеспечивая желаемое состояние кластера.

Это обеспечивает полностью автоматический и декларативный процесс развертывания, минимизируя ручные операции и ошибки.

## Примеры команд

*   **Запуск локально**: `docker compose up --build`
*   **Применение Kustomize манифестов**: `kubectl apply -k infra/k8s/base`
*   **Получение пароля ArgoCD**: `kubectl get secret argocd-initial-admin-secret -n argocd -o jsonpath="{.data.password}" | base64 -d`
*   **Проброс порта UI (для отладки)**: `kubectl port-forward svc/ui-service 3000:3000`
*   **Проверка подов**: `kubectl get pods -A`