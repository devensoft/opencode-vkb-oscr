# OpenSpec Verification Guide

How to interpret and act on `/opsx-verify` output.

## Running Verification

Execute verification for a change:

```
/opsx-verify <change-name>
```

Example:
```
/opsx-verify user-authentication-v2
```

## Understanding Output Sections

### Summary Section

```
================================
OpenSpec Verification: user-auth-v2
================================
Status: PASS / FAIL / PARTIAL
Phases: 3 total, 2 passed, 1 partial
Coverage: 94%
```

**Status meanings:**
- **PASS**: All checks passed, ready to proceed
- **FAIL**: Blocking issues found, must fix
- **PARTIAL**: Non-blocking issues, can proceed with follow-up

### Phase Breakdown

```
Phase 1: Foundation [PASS]
- Schema files created: 3/3
- Validation implemented: YES
- Tests passing: 12/12

Phase 2: API Integration [PARTIAL]
- Endpoints implemented: 4/5
- Authentication middleware: YES
- Error handling: PARTIAL
  ⚠ Missing 400 response documentation
  ⚠ Rate limiting not implemented

Phase 3: Frontend [PASS]
- Login form: YES
- Error display: YES
- Session management: YES
```

**PASS indicators:**
- All items checked
- No warnings
- "YES" or "X/X" complete

**PARTIAL indicators:**
- Some items incomplete
- Warnings (⚠) present
- May have "N/A" entries

**FAIL indicators:**
- Critical items missing
- Errors (✗) present
- Required components not found

### Specification Compliance

```
Specification Compliance:
- OpenSpec schema valid: YES
- Required fields present: 8/8
- Type definitions complete: YES
- Documentation coverage: 85%
```

**Critical checks:**
- Schema valid: Must be YES
- Required fields: Must match expected count
- Type definitions: Must be complete

### Implementation Coverage

```
Implementation Coverage:
- Files created: 15
- Files modified: 3
- Lines added: 450
- Test coverage: 87%
- Documentation: 4 files
```

**Compare against baseline:**
- Coverage should not drop significantly
- Documentation files should exist
- Test coverage should meet thresholds

## Issue Classification

### Blocking Issues (Must Fix)

**Characteristics:**
- Marked with ✗ or "FAIL"
- Prevents system from working
- Breaks existing functionality
- Missing critical components

**Examples:**
```
✗ Main entry point not found
✗ Required API endpoint missing
✗ Database migration failed
✗ Build errors introduced
```

**Action:** Fix in current phase before proceeding.

### Non-Blocking Issues (Document)

**Characteristics:**
- Marked with ⚠ or "PARTIAL"
- Doesn't prevent basic functionality
- Nice-to-have improvements
- Documentation gaps

**Examples:**
```
⚠ Additional error handling recommended
⚠ Edge case not covered
⚠ Documentation could be expanded
⚠ Performance optimization possible
```

**Action:** Document and create follow-up card.

### Informational (No Action)

**Characteristics:**
- Marked with ℹ
- Suggestions for improvement
- Alternative approaches
- Style recommendations

**Examples:**
```
ℹ Consider using TypeScript strict mode
ℹ Could refactor for better readability
```

**Action:** Review, optionally address, no follow-up required.

## Common Verification Patterns

### Schema Validation

**Check output:**
```
Schema Validation:
- OpenSpec files: 3
- Valid schemas: 3
- Invalid schemas: 0
- Missing schemas: 0
```

**Interpretation:**
- Valid schemas == OpenSpec files: PASS
- Any invalid: Investigate specific errors
- Missing schemas: Check file paths

### Test Verification

**Check output:**
```
Test Results:
- Unit tests: 45/45 PASS
- Integration tests: 12/12 PASS
- E2E tests: 8/10 PASS
  ✗ Login flow timeout
  ✗ Session persistence
```

**Interpretation:**
- All pass: Continue
- Some fail: Check if related to changes
- E2E failures: Often environmental, verify manually

### Documentation Check

**Check output:**
```
Documentation:
- README updated: YES
- API docs: YES
- Changelog: NO
- Code comments: PARTIAL
```

**Interpretation:**
- Required docs (README, API): Must be YES
- Changelog: Optional but recommended
- Comments: PARTIAL acceptable if code is clear

## Action Matrix

| Result | Blocking | Action |
|--------|----------|--------|
| PASS | None | Proceed to next step |
| PARTIAL | None | Proceed, create follow-up cards |
| PARTIAL | Some | Fix blocking, document non-blocking |
| FAIL | Critical | Stop, fix before proceeding |

## Follow-Up Card Template

For non-blocking issues:

```markdown
## OpenSpec Verification Follow-up

**Change**: <change-name>
**Phase**: N: <phase-name>
**Found By**: /opsx-verify on YYYY-MM-DD

### Issue
<Description from verification output>

### Severity
Non-blocking

### Suggested Resolution
<How to fix>

### Files Affected
- file1.ts
- file2.ts

### Related
- Main change: <change-name>
```

## Re-Running Verification

After fixes, re-run:

```
/opsx-verify <change-name>
```

Compare output to previous run:
- Fixed issues should be resolved
- New issues should not appear
- Status should improve

## Verification Best Practices

1. **Run at phase completion**
   - After tests pass
   - After merge complete
   - Before pushing base branch

2. **Document all issues**
   - Screenshot or save output
   - Note which are blocking
   - Create follow-up cards immediately

3. **Track trends**
   - Note recurring issues
   - Update checklists to prevent
   - Improve specifications

4. **Use with other checks**
   - Not a replacement for tests
   - Complements manual review
   - Validates specification compliance
