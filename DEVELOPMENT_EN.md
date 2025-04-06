# Development Process Specification

## Git Commit Convention

Using Conventional Commits specification with format:

### Commit Type Reference
| Type     | Description                  | Example                  |
|----------|------------------------------|--------------------------|
| feat     | New feature                  | `feat: Add cache purge`  |
| fix      | Bug fix                      | `fix: Fix signature verification` |
| docs     | Documentation updates        | `docs: Update API docs`  |
| style    | Code formatting/styling      | `style: Format module`    |
| refactor| Code refactoring             | `refactor: Optimize error handling` |
| test     | Test related                 | `test: Add unit tests`    |
| chore    | Build/tool changes           | `chore: Update deps`      |
| ci       | CI configuration changes     | `ci: Add GitHub Actions`  |

### Commit/Publish Methods

#### Committing
1. Regular commit (with auto-validation):
```bash
git commit -m "feat: Add cache purge feature"
```

2. Interactive commit (recommended):
```bash
pnpm run commit
```

#### Publishing
```bash
pnpm run release
```

## Testing
### Basic Test Scripts
1. Build:
```bash
pnpm run build
```

2. Run tests:
```bash
pnpm run test
```

### Full Action Environment Simulation

#### Test Environment Setup
1. Install Docker
2. Install act and configure environment variables [act docs](https://github.com/nektos/act)

#### Test Procedure
1. Build:
```bash
pnpm run build
```

2. Run tests:
```bash
pnpm run docker-test
```

## Branch Management
- `main`: Production branch
- `dev`: Development branch
- `feature/*`: Feature branches
- `fix/*`: Bugfix branches