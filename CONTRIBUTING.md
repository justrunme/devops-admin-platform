# Contributing

## Development setup

```bash
# API
cd api && go mod download
# UI
cd ui && npm ci
# Local stack
make up          # docker compose
```

## Branch naming

- `feat/<short-name>`
- `fix/<short-name>`
- `chore/<short-name>`
- `docs/<short-name>`
- `ci/<short-name>`

## Commits

Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`, `test:`, `ci:`.

## Tests

```bash
cd api && go vet ./... && go test ./...
cd ui && npm ci && npm run build
cd terraform && terraform init -backend=false && terraform validate
```

## Pull requests

Open against `main`. CI jobs (`go-test`, `ui-build`, `terraform-validate`, `actionlint`) must be green. Squash merge preferred.

Checklist:

- [ ] Go tests pass in `api/`
- [ ] UI builds
- [ ] Terraform validates
- [ ] Branch naming follows convention
- [ ] Conventional commits
