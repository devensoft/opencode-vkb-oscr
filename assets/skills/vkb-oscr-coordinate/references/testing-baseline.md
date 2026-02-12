# Testing Baseline (BL-004)

Baseline metrics and validation guidelines for VKB-OpenSpec changes.

## Baseline Metrics Reference

The testing baseline provides a reference point for validating that changes don't introduce regressions.

### Metric Categories

1. **Unit Test Pass Rate**
   - Baseline: 100% passing
   - Acceptable: ≥98% passing
   - Action required if <98%

2. **Code Coverage**
   - Baseline: Project-specific (see docs/testing.md)
   - Acceptable: Within 2% of baseline
   - Action required if >3% drop

3. **E2E Test Pass Rate**
   - Baseline: 100% passing
   - Acceptable: ≥95% passing
   - Action required if <95%

4. **Build Status**
   - Baseline: Clean build, no errors
   - Acceptable: No new errors
   - Action required if build fails

5. **Lint/Static Analysis**
   - Baseline: Zero critical issues
   - Acceptable: No new critical issues
   - Warnings acceptable if documented

## Test Execution Order

Recommended test execution sequence:

1. **Unit Tests** (fast feedback)
   ```bash
   npm test
   # or
   pytest
   # or
   cargo test
   ```

2. **Build Verification** (catches syntax errors)
   ```bash
   npm run build
   # or
   cargo build
   # or
   go build
   ```

3. **E2E Tests** (comprehensive validation)
   ```bash
   npm run test:e2e
   # or
   pytest tests/e2e/
   ```

4. **Static Analysis** (code quality)
   ```bash
   npm run lint
   # or
   cargo clippy
   # or
   golangci-lint run
   ```

## Test Result Comparison

### Documenting Results

After running tests, document:

```markdown
## Phase N Test Results

**Date:** YYYY-MM-DD
**Phase:** N: <phase-name>

### Unit Tests
- Run: 150
- Passed: 150
- Failed: 0
- Status: PASS

### E2E Tests
- Run: 25
- Passed: 25
- Failed: 0
- Status: PASS

### Build
- Status: SUCCESS
- Warnings: 0

### Lint
- Errors: 0
- Warnings: 3 (pre-existing)

### Comparison to Baseline
- Unit tests: MATCH
- Coverage: 94% (baseline 95%, -1% - acceptable)
- Build: MATCH
- Lint: MATCH

**Overall:** PASS
```

### Acceptable Variations

Minor variations that don't require action:

- Coverage drop ≤2% due to removed code
- New warnings in test files only
- Pre-existing failures remain unchanged
- Platform-specific test skips

### Unacceptable Variations

Variations that must be addressed:

- Any new test failures
- Coverage drop >3%
- New build errors
- New critical lint issues
- Functional test regressions

## Framework-Specific Guidelines

### Node.js / npm Projects

**Required commands:**
```bash
npm test              # Unit tests
npm run test:e2e      # E2E tests
npm run build         # Production build
npm run lint          # ESLint/TSLint
```

**Common baseline files:**
- `docs/testing.md`
- `jest.config.js` coverage settings
- `.eslintrc` rules

### Python Projects

**Required commands:**
```bash
pytest               # All tests
pytest --cov         # With coverage
pytest -m e2e        # E2E only
```

**Common baseline files:**
- `pytest.ini`
- `.coveragerc`
- `tox.ini`

### Rust Projects

**Required commands:**
```bash
cargo test           # Unit + integration
cargo test --release # Release mode
cargo build --release # Build verification
cargo clippy         # Linting
```

**Common baseline:**
- `Cargo.toml` test configuration
- Clippy warnings baseline

### Go Projects

**Required commands:**
```bash
go test ./...        # All packages
go test -race ./...  # Race detection
go build             # Build verification
golangci-lint run    # Linting
```

**Common baseline:**
- `go test` output
- lint configuration

## Handling Test Failures

### Investigation Steps

1. **Determine scope**
   - How many tests failed?
   - Are failures related to changes?
   - Are failures pre-existing?

2. **Check for environmental issues**
   - Network dependencies
   - File permissions
   - Missing environment variables

3. **Analyze failures**
   - Read failure messages
   - Check stack traces
   - Compare to baseline run

4. **Decision matrix**

| Scenario | Action |
|----------|--------|
| Pre-existing failure | Document, proceed |
| Related to change | Fix before proceeding |
| Unrelated to change | Create follow-up card |
| Environmental | Retry, then document |

### Fix-or-Document Decision

**Fix in current phase:**
- Failures directly caused by changes
- Regressions from baseline
- Critical path functionality

**Document for follow-up:**
- Pre-existing failures
- Unrelated component failures
- Edge cases discovered (non-blocking)

## Baseline Maintenance

Update baseline when:
- Significant architectural changes
- Test suite restructuring
- Coverage improvements
- Major dependency updates

**Do NOT update baseline for:**
- Routine changes
- Temporary test failures
- Single phase regressions
