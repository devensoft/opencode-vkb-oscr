---
name: vkb-oscr-coordinate
description: Coordinate execution of OpenSpec-driven Vibe KanBan cards. Use when (1) monitoring card status and waiting for DONE, (2) executing manual merge-back workflows, (3) running tests and verification, (4) handling tasks.md updates and conflicts, (5) managing phase-to-phase transitions. Guides through the critical 60-second grace period, branch HEAD verification, manual merging, and testing protocols with user-configurable test commands.
license: MIT
compatibility: opencode
metadata:
  workflow: vkb-openspec
  role: coordinator
---

# VKB-OpenSpec Change Request: Coordinator

Guides coordinators through executing and monitoring VKB cards for an OpenSpec change request.

## Critical Understanding

**VKB does NOT:**
- Auto-merge branches after completing work
- Reliably run tests (test results may be stale or missing)
- Run OpenSpec verification automatically

**Coordinator MUST do all of these manually.** This skill ensures nothing is missed.

## Prerequisites Checklist

Before coordinating a phase, verify:

- [ ] Card was created by `vkb-oscr-plan`
- [ ] Phase branch exists (`phase-N-<name>`)
- [ ] Coordinator knows which phase they're coordinating
- [ ] Base branch is stable

## Step 1: Configure Test Commands

Use octto interactive session to determine test framework:

```
Question 1: Test Framework (pick_one)
"What testing framework/commands does this project use?"
- A) npm (Node.js): npm test, npm run test:e2e, npm run build
- B) Python: pytest, pytest --cov
- C) Rust: cargo test, cargo build
- D) Go: go test, go build
- E) Java/Maven: mvn test, mvn package
- F) Other (specify below)

Question 2: Custom Commands (ask_text, multiline)
"Please specify your test commands (one per line):"
(Only show if F selected)

Question 3: Baseline Metrics (pick_one)
"Do you have a baseline metrics file to reference?"
- A) Yes, use docs/testing.md (BL-004)
- B) Yes, specify path:
- C) No, skip baseline validation
```

Save test configuration for this session.

## Step 2: Monitor Card Status

Query VKB card status until "done":

```
vibe_kanban_get_task <task_id>
```

**CRITICAL: Only trust "done" status.**

VKB behavior quirks:
- Status may show "done" temporarily then revert
- Status may show "inprogress" for extended periods
- Status may show "inreview" before actual completion

**Rule:** Wait for status === "done" and verify it persists for at least one polling cycle.

## Step 3: 60-Second Grace Period

After card shows "done":

**WAIT 60 SECONDS**

VKB may commit late changes after marking done. This includes:
- Final file adjustments
- tasks.md updates
- Configuration tweaks

Use a timer or manual count. Do not skip this step.

## Step 4: Verify Branch HEADs

Check both branches before proceeding:

```bash
# Check base branch
git checkout <base-branch>
git pull
git log --oneline -3
BASE_HEAD=$(git rev-parse HEAD)

# Check phase branch
git checkout <phase-branch>
git pull
git log --oneline -3
PHASE_HEAD=$(git rev-parse HEAD)

# Check for VKB temp branches
git branch -r | grep "^  vk/"
# If found, check their HEADs too
git log --oneline vk/temp-branch -3 2>/dev/null || echo "No vk/ branches"
```

Document the HEADs for verification.

## Step 5: Determine If Merge Needed

Check if base already contains phase HEAD:

```bash
git checkout <base-branch>
git branch --contains $PHASE_HEAD
```

**If output shows "* <base-branch>":**
- Merge already completed (VKB may have done it)
- Skip to Step 7

**If no output:**
- Manual merge required
- Continue to Step 6

## Step 6: Manual Merge-Back

Execute manual merge:

```bash
git checkout <base-branch>
git merge <phase-branch> --no-ff -m "Merge phase-N: <phase-name> into <base-branch>"
```

**If conflicts occur (common in tasks.md):**

```bash
git status
# Identify conflicted files
```

**Resolving tasks.md conflicts:**
- Keep the most up-to-date version
- Preserve completed task markers [x]
- Merge task descriptions if both changed
- When in doubt, keep more information

```bash
# After resolving
git add tasks.md
git commit -m "Resolve tasks.md conflicts after phase merge"
```

See [references/merge-conflict-resolution.md](references/merge-conflict-resolution.md) for detailed examples.

## Step 7: Run Tests

Execute configured test commands:

**If npm selected:**
```bash
npm test
npm run test:e2e
npm run build
npm run lint
```

**If Python selected:**
```bash
pytest
pytest --cov
```

**If Rust selected:**
```bash
cargo test
cargo build --release
```

**If Go selected:**
```bash
go test ./...
go build
```

**If Java selected:**
```bash
mvn test
mvn package
```

**Compare results against baseline:**
- Check [references/testing-baseline.md](references/testing-baseline.md) for BL-004 metrics
- Document any regressions
- Fix blocking failures before proceeding

## Step 8: OpenSpec Verification

Run verification:

```
/opsx-verify <change-name>
```

**Review verification output:**
- Check for spec mismatches
- Verify all phase tasks completed
- Note any warnings or non-blocking issues

**If failures found:**
- Assess severity (blocking vs non-blocking)
- Fix in current phase if blocking
- Document non-blocking issues for follow-up

See [references/verification-guide.md](references/verification-guide.md) for interpreting output.

## Step 9: Update tasks.md

Check current state of tasks.md:

```bash
git show HEAD:tasks.md | head -50
```

**If VKB didn't update tasks.md:**
- Mark completed tasks with [x]
- Add concise completion notes
- Update current phase status

**Example update:**
```markdown
## Phase 1: Foundation [COMPLETED]
- [x] Create OpenSpec schema files
- [x] Implement validation logic
- [x] Add error handling

**Notes:** Phase 1 completed. Validation logic tested successfully.
```

Commit changes:
```bash
git add tasks.md
git commit -m "Update tasks.md after phase N completion"
```

## Step 10: Push Base Branch

Push completed work:

```bash
git push origin <base-branch>
```

Verify push succeeded:
```bash
git log --oneline -3 origin/<base-branch>
```

## Handling Non-Blocking Issues

If verification finds non-blocking issues:

1. **Document the issue:**
   - File/component reference
   - Description of the issue
   - Suggested fix

2. **Create follow-up VKB card:**
   - Status: todo
   - Title: "Follow-up: <issue description>"
   - Priority: Based on severity
   - Description: Include reference to main change

**Follow-up card template:**
```markdown
## Follow-up Issue from <change-name> Phase N

**Original Change**: <change-name>
**Original Phase**: Phase N: <phase-name>
**Severity**: Non-blocking
**Component**: <file/component>

**Issue Description**:
<description>

**Suggested Fix**:
<suggestion>

**Related Work**:
- Main change: <change-name>
- Phase: N
```

3. **Continue with current phase completion**

## Completion Checklist

Before proceeding to next phase or finalizing:

- [ ] Card status is "done"
- [ ] 60-second grace period elapsed
- [ ] Branch HEADs verified (base contains phase)
- [ ] Tests pass against baseline
- [ ] OpenSpec verification passes
- [ ] tasks.md updated
- [ ] Base branch pushed
- [ ] Follow-up cards created (if non-blocking issues)
- [ ] Ready for next phase or finalize

## Next Steps

**If more phases remain:**
> Proceed to `vkb-oscr-coordinate` for next phase

**If final phase complete:**
> Proceed to `vkb-oscr-finalize` to complete change

## References

- [VKB Behavior Quirks](references/vkb-behavior.md) - Documented VKB quirks and workarounds
- [Testing Baseline](references/testing-baseline.md) - BL-004 metrics and validation
- [Merge Conflict Resolution](references/merge-conflict-resolution.md) - tasks.md conflict examples
- [Verification Guide](references/verification-guide.md) - Interpreting /opsx-verify output
