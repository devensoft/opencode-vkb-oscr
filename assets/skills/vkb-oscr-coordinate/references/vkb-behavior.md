# VKB Behavior Quirks

Documented quirks and behaviors of Vibe KanBan (VKB) that coordinators must understand.

## Status Reliability

### The "Done" Problem

**Critical:** Only trust status when it shows "done" consistently.

VKB status behavior:
- Status may temporarily show "done" during processing
- Status may flip from "done" back to "inprogress"
- Status may get stuck on "inreview" even when work is complete

**Best Practice:**
1. Poll status until it shows "done"
2. Wait one polling cycle (30-60 seconds)
3. Poll again to confirm it still shows "done"
4. Only proceed after confirmed stable

### Status Polling Pattern

```
Poll → Check status
If "done":
  Wait 60 seconds
  Poll again
  If still "done": Proceed
  Else: Continue polling
Else:
  Continue polling
```

## No Auto-Merge

**VKB does NOT auto-merge branches after completing work.**

This is by design. VKB focuses on code generation, not repository management.

**Coordinator must:**
1. Monitor for completion
2. Verify branch state
3. Execute manual merge if needed
4. Handle any conflicts
5. Push to base branch

## Late Commits

VKB may commit changes AFTER marking status as "done".

Common late commits:
- tasks.md updates
- Configuration file adjustments
- Formatting fixes
- Missing file additions

**The 60-Second Rule:**
Always wait 60 seconds after seeing "done" before proceeding.

## Temporary Branches

VKB creates temporary branches with `vk/` prefix:
- Used during processing
- May persist after completion
- Usually safe to ignore
- Can be cleaned up post-change

**To check for vk/ branches:**
```bash
git branch -r | grep "^  vk/"
```

## Test Execution

**VKB test execution is unreliable:**
- May run tests on stale code
- May skip tests entirely
- Test results may not reflect actual state

**Coordinator must:**
- Always run tests manually after merge
- Compare against baseline metrics
- Not trust VKB-provided test results

## tasks.md Updates

VKB attempts to update tasks.md but:
- Updates may be incomplete
- Updates may conflict with manual changes
- Updates may happen late (after "done" status)

**Coordinator must:**
- Verify tasks.md state after grace period
- Manually update if VKB didn't
- Handle conflicts during merge

## Status Flapping

"Status flapping" occurs when status rapidly changes:
- todo → inprogress → inreview → inprogress → inreview → done
- Usually indicates VKB is actively working
- Normal during active processing
- Settle time required after completion

## Recovery Scenarios

### VKB appears stuck

If status unchanged for >10 minutes:
1. Check branch directly for new commits
2. Review VKB output for errors
3. Consider creating new card with clearer instructions

### VKB marked done but no changes

1. Wait 60 seconds (grace period)
2. Check branch for late commits
3. Verify card was assigned to correct branch
4. Create follow-up card if needed

### Merge conflicts prevent completion

1. Resolve conflicts manually
2. Document resolution in commit message
3. Continue with test execution
4. Verify no functionality lost

## Summary

| Quirk | Impact | Mitigation |
|-------|--------|------------|
| Status unreliability | May proceed too early | Confirm "done" twice with delay |
| No auto-merge | Changes not in base | Manual merge required |
| Late commits | Missing changes | 60-second grace period |
| Unreliable tests | False confidence | Always run tests manually |
| tasks.md issues | Tracking problems | Manual verification |
