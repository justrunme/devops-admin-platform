# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-10-10

### Added
- MIT `LICENSE` and `SECURITY.md` with private reporting via GitHub Security Advisories
- Grouped monthly Dependabot updates for Go modules, npm, Docker, Terraform, and GitHub Actions
- CI workflow for Go tests, UI build, Terraform validate, and actionlint
- Agent `/ping` API endpoint and `requirements.txt` for the Python agent

### Fixed
- Terraform Platform Deployment Test failing because Minikube rejected unsupported Kubernetes 1.27.3; CI now uses kind with Kubernetes 1.37
- Removed committed Next.js build output (`ui/.next`) and expanded `.gitignore`
- Removed CI failure masking (`|| true`) from Docker image tag commits
- Service DNS for UI/agent now targets the Helm `api` service

### Changed
- Updated GitHub Actions, Go (1.27), Node (24), Terraform (1.16.5), kind (0.33.0), and related Helm chart versions
- Bitnami PostgreSQL/Redis charts switched to OCI (`oci://registry-1.docker.io/bitnamicharts`)
- README aligned with the repository layout and actual tech stack
