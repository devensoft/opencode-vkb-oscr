---
name: vkb-oscr-finalize
description: Finalize and archive OpenSpec change requests after all VKB phases complete. Use when (1) all phase cards are done and merged, (2) syncing delta specs to canonical specs, (3) archiving the change, (4) validating final implementation, (5) deciding on main branch merge or PR creation. Guides through final verification, spec synchronization, archival, and post-completion actions.
license: MIT
compatibility: opencode
metadata:
  workflow: openspec
  audience: developers
---

# VKB-OpenSpec Change Request Finalization

Complete the OSCR lifecycle by finalizing, syncing, and archiving a change request after all phases are done.

## Overview

Finalization is the last phase of the OSCR workflow:

1. Verify all phase cards are complete
2. Run comprehensive verification
3. Sync delta specs to canonical specs
4. Archive the change
5. Merge or tag as appropriate

**Critical**: Final verification must pass before syncing. Sync is atomic—all operations succeed or none do.

## Prerequisites

Confirm all before proceeding:

- [ ] All phase cards show status `done`
- [ ] All phase branches merged to base branch
- [ ] Base branch is up-to-date with all changes
- [ ] Final tests pass against baseline

If any prerequisite is missing, return to the planning phase.

## Finalization Workflow

Copy this checklist and track progress:

```
Finalization Progress:
- [ ] Step 1: Run final verification
- [ ] Step 2: Handle any remaining issues
- [ ] Step 3: Sync delta specs to canonical
- [ ] Step 4: Verify sync success
- [ ] Step 5: Archive the change
- [ ] Step 6: Verify archive
- [ ] Step 7: Push all changes
- [ ] Step 8: Run final testing
```

### Step 1: Final Verification

Run comprehensive verification:

```
/opsx-verify <change-name>
```

Review the output for:
- All requirements satisfied
- No blocking issues
- Non-blocking issues documented

### Step 2: Handle Remaining Issues

**If verification finds blocking issues:**
1. Fix in base branch
2. Re-run verification
3. Only proceed when verification passes

**If non-blocking issues found:**
1. Create follow-up cards with `vibe_kanban_create_task`
2. Status: `todo`
3. Link to original change
4. Document in completion summary

### Step 3: Sync Delta Specs

Merge delta specs to canonical specs:

```
/opsx-sync <change-name>
```

This applies operations in order: RENAMED → REMOVED → MODIFIED → ADDED.

For detailed operation behavior, see [references/sync-operations.md](references/sync-operations.md).

### Step 4: Verify Sync Success

```bash
# Check spec updates
git status openspec/specs/
git diff openspec/specs/

# Validate specs
openspec validate
```

### Step 5: Archive Change

Move change to archive:

```
/opsx-archive <change-name>
```

Creates: `openspec/changes/archive/YYYY-MM-DD-<change-name>/`

For archive process details, see [references/archive-process.md](references/archive-process.md).

### Step 6: Verify Archive

```bash
# Confirm archive exists
ls -la openspec/changes/archive/

# Confirm original removed
ls openspec/changes/ | grep -v archive
```

### Step 7: Push Changes

```bash
git add openspec/
git commit -m "Complete OSCR: sync and archive <change-name>"
git push origin <base-branch>
```

### Step 8: Final Testing

Run complete test suite and compare to baseline (BL-004 or custom):

| Metric | Baseline | Actual | Pass? |
|--------|----------|--------|-------|
| Unit Tests | 1123 | <actual> | ±10 |
| E2E Tests | 81 | <actual> | 80-95 |
| Build Size | 307KB | <actual> | <405KB |

## Post-Completion Actions

Choose one path:

**Option A: Merge to Main (Recommended)**

```bash
# Create PR
gh pr create --title "feat: <change-name>" --base main --head <base-branch>

# Or direct merge
git checkout main
git merge <base-branch> --no-ff -m "feat: <change-name>"
git push origin main
```

**Option B: Keep Base Branch**
- Future changes branch from it
- Document in project wiki

**Option C: Tag Release**

```bash
git tag -a "v<version>-<change-name>" -m "Complete <change-name>"
git push origin --tags
```

## Documentation Updates

Update after finalization:

- [ ] Add entry to CHANGELOG.md
- [ ] Update README sections
- [ ] Document API changes
- [ ] Update architecture diagrams (if applicable)

## Completion Summary

Create this summary after finalization:

```markdown
## OSCR Complete: <change-name>

**Date**: YYYY-MM-DD
**Base Branch**: <base-branch>
**Phases Completed**: N
**Follow-up Cards**: <count>

### Changes Summary
- <brief description>

### Verification Results
- OpenSpec Verification: ✅ PASS
- Unit Tests: <actual>/<baseline>
- E2E Tests: <actual>/<baseline>
- Build Size: <actual>KB

### Archive Location
openspec/changes/archive/YYYY-MM-DD-<change-name>/

### Follow-up Items
- [ ] <follow-up 1>
- [ ] <follow-up 2>
```

## Optional Cleanup

After completion:

- [ ] Review and close related issues
- [ ] Update project board
- [ ] Notify team members
- [ ] Schedule retrospective (for significant changes)

## Post-Completion Checklist

See [references/post-completion-checklist.md](references/post-completion-checklist.md) for full post-completion steps.
