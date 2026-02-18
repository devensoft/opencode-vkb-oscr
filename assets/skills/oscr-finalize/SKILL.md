---
name: oscr-finalize
description: Phase 3 finalization workflow for OSCR. Syncs OpenSpec artifacts, verifies completion, and archives finished changes. Use after oscr-execute completes Phase 2.
license: MIT
compatibility: opencode
---

# OSCR Finalize (Phase 3)

Sync OpenSpec artifacts, verify completion, archive, and report results.

## Prerequisite

Load state via `oscr_load`. Verify `phase` is `"finalize"`.

## Step 1: Sync Artifacts

For each card where `status === "done"`:

```bash
openspec sync <change-name>
```

This applies delta specs to canonical specs. If sync fails, log the error and continue to the next card — do not abort the entire finalization.

## Step 2: Verify Completion

For each successfully synced card:

```bash
openspec verify <change-name>
```

Review the output:
- **All requirements satisfied**: proceed to archive
- **Blocking issues found**: log as warning, skip archive for this change, add to escalation report
- **Non-blocking issues found**: note in summary, proceed to archive

## Step 3: Archive

For each verified card:

```bash
openspec archive <change-name>
```

This moves the change to `openspec/changes/archive/`. Confirm the archive was created and the active change was removed.

## Step 4: Generate Summary Report

Build a report covering all cards:

```
OSCR Run Summary: {state.runId}
Started: {state.startedAt}
Completed: {now}

Cards:
  DONE:      {list of done cards with change names}
  ESCALATED: {list of escalated cards with reasons}
  SKIPPED:   {list of any cards that failed sync/verify}

Changes archived: {count}
Changes needing attention: {count}
```

## Step 5: Clean Up

- If ALL cards are `"done"` and archived: delete the state file (`.opencode/.oscr-state.json`)
- If any cards are escalated or skipped: keep the state file for investigation

## Step 6: Report to User

Present the summary report. If there are escalated items, provide actionable next steps:
- Which changes need manual review
- What specific issues were found
- Suggested commands to re-run individual changes
