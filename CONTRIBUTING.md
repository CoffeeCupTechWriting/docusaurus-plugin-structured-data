# Contributing Guide

Thank you for your interest in contributing to this project! This guide explains how to contribute code, report bugs, and suggest improvements.

## Development Setup

1. **Fork and clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/docusaurus-plugin-structured-data.git
cd docusaurus-plugin-structured-data
```

2. **Install dependencies**
```bash
npm install
```

3. **Create a feature branch**
```bash
git checkout -b feature/your-feature-name
```

## Development Workflow

### Build the project
```bash
npm run build        # Compile TypeScript
npm run watch       # Watch mode (recompile on changes)
```

### Run tests
```bash
npm test            # Run all tests
npm run test:watch  # Watch mode
npm run test:coverage  # Generate coverage report
```

### Commit Message Convention

This project uses **Conventional Commits** for automatic versioning with semantic-release.

Format:
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types** (determines version bump):
- `feat:` - New feature (MINOR bump)
- `fix:` - Bug fix (PATCH bump)
- `perf:` - Performance improvement (PATCH bump)
- `docs:` - Documentation only (NO bump)
- `style:` - Code style changes (NO bump)
- `refactor:` - Code refactoring (NO bump)
- `test:` - Test changes (NO bump)
- `chore:` - Build process, dependencies (NO bump)

**Examples:**

```bash
# Feature - will trigger MINOR version bump (1.0.0 → 1.1.0)
git commit -m "feat(generator): add support for custom schema types"

# Bug fix - will trigger PATCH version bump (1.0.0 → 1.0.1)
git commit -m "fix(logger): handle undefined verbose flag"

# Documentation - no version bump
git commit -m "docs: add i18n configuration examples"

# Breaking change - triggers MAJOR version bump (1.0.0 → 2.0.0)
git commit -m "feat(api)!: change plugin options structure"
```

## Git Workflow

1. **Make your changes**
```bash
# Edit files, test locally
npm run build
npm test
```

2. **Commit with conventional commit message**
```bash
git commit -m "feat(generator): add new schema type support"
```

3. **Push to your fork**
```bash
git push origin feature/your-feature-name
```

4. **Create a Pull Request**
   - Describe what your PR does
   - Link any related issues
   - Ensure all checks pass

## CI/CD Pipeline

When you push or create a PR, the following checks run automatically:

✅ **Tests** - All Jest tests must pass
✅ **Build** - TypeScript must compile without errors
✅ **Security** - npm audit checks for vulnerabilities

## Automated Release Process

When a PR is merged to `main`:

1. **semantic-release** analyzes commits
2. **Version is bumped** automatically:
   - `feat:` commits → MINOR version
   - `fix:` commits → PATCH version
3. **NPM package** is published automatically
4. **GitHub Release** is created with release notes

### Examples of automatic releases:

```
Commits: fix(logger), fix(generator)
Result: 1.0.0 → 1.0.1 (PATCH)

Commits: feat(generator), fix(logger)
Result: 1.0.0 → 1.1.0 (MINOR)

Commits: feat!: breaking change in API
Result: 1.0.0 → 2.0.0 (MAJOR)
```

## Code Style

- **TypeScript**: Use strict mode (enabled in tsconfig.json)
- **Formatting**: Follow existing code style
- **Naming**: Use camelCase for variables/functions, PascalCase for types/interfaces
- **Comments**: Add comments for complex logic

## Testing

- Write tests for new features
- Ensure all tests pass before pushing
- Aim for meaningful test coverage

Run tests:
```bash
npm test              # Single run
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report
```

## Pull Request Checklist

Before submitting a PR, ensure:

- [ ] Code follows the project style
- [ ] All tests pass locally (`npm test`)
- [ ] TypeScript builds without errors (`npm run build`)
- [ ] Commits follow conventional commit format
- [ ] PR description explains the changes
- [ ] No breaking changes (or clearly documented)

## Reporting Bugs

When reporting bugs, include:

1. **Description**: What happened vs. what should happen
2. **Steps to reproduce**: Exact steps to trigger the bug
3. **Environment**: Node version, npm version, OS
4. **Error message**: Full error output if applicable
5. **Code example**: Minimal reproduction case

## Suggesting Improvements

Great ideas are welcome! When suggesting improvements:

1. Describe the current behavior
2. Explain the desired behavior
3. Explain why this improvement would be valuable
4. Provide examples if possible

## Questions?

- Check existing [issues](https://github.com/CoffeeCupTechWriting/docusaurus-plugin-structured-data/issues)
- Check [README](README.md) and [PUBLISHING guide](PUBLISHING.md)
- Create an issue to discuss your idea

---

Thank you for contributing! 🙏
