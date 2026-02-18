---
name: oscr-execute
description: Phase 2 execution loop for OSCR. Launches VKB cards, waits for completion, reviews output, handles fixes, and merges branches. Use after oscr-plan completes Phase 1.
license: MIT
compatibility: opencode
---

# OSCR Execute (Phase 2)

The core execution loop. For each card in "pending" status, run the 5-step cycle below.

**Before any VKB API interaction, load `oscr-vkb-quirks` for critical workarounds.**

## Prerequisite

Load state via `oscr_load`. Verify `phase` is `"execute"`.

## Execution Loop

Process each card where `status === "pending"` (or `"fixing"` for re-entry after review failure).

---

### Step 1: Create and Launch Card

1. **Create and start** the VKB task via HTTP (use bash with curl — no MCP tool exists for this):

```bash
curl -s -X POST "{vkbBaseUrl}/api/tasks/create-and-start" \
  -H "Content-Type: application/json" \
  -d '{
    "task": {
      "project_id": "{legacyProjectId}",
      "title": "{cardTitle}"
    },
    "executor_profile_id": {
      "executor": "{executorId}",
      "variant": null
    },
    "repos": [{
      "repo_id": "{repoId}",
      "target_branch": "{baseBranch}"
    }]
  }'
```

2. **Record** `task_id` and `workspace_id` from the response on the card.

3. **Get session ID**: `GET {vkbBaseUrl}/api/sessions?workspace_id={workspace_id}`, take the first session's `id`.

4. **Send instructions immediately** via `oscr_follow_up`. VKB does NOT pass task descriptions to executors — the follow-up is the only way to deliver instructions. Build the prompt by:
   - Reading the card template from `.opencode/templates/card-template.md`
   - Filling placeholders with change context from `openspec instructions <change-name> --json`
   - Sending via `oscr_follow_up` with sessionId, vkbBaseUrl, rendered template, executorId

5. **Update card**: set `status` to `"launched"`, record `taskId`, `workspaceId`, `sessionId`, `startTime`. Save state via `oscr_save`.

---

### Step 2: Wait for Completion

Call `oscr_wait` with `taskId`, `vkbBaseUrl`, `pollIntervalMs`, `stallTimeoutMs`.

**On completion** (`completed: true`):
- Set card `status` to `"reviewing"`
- Extract `worktreeBranch` from VKB task metadata if available
- Save state, proceed to Step 3

**On timeout** (`timedOut: true`):

Check `hasInProgressAttempt` from the result:

- If `hasInProgressAttempt === true` (task stalled):
  - If `card.nudgeSent === false`:
    1. Send ONE follow-up via `oscr_follow_up`: *"Report your current status. If you can complete within 5 minutes, do so. Otherwise, commit what you have and stop."*
    2. Set `card.nudgeSent = true`
    3. Save state
    4. Wait again with `oscr_wait` using `stallTimeoutMs / 2` as timeout
    5. If still not complete after second wait: set `status` to `"escalated"`, log warning, save state, continue to next card
  - If `card.nudgeSent === true`:
    - Set `status` to `"escalated"`, log warning, save state, continue to next card
- If `hasInProgressAttempt === false`: treat as completed, proceed to Step 3

---

### Step 3: Review via Sub-Agent

Invoke `@oscr-reviewer` via Task tool, pointing it at the worktree branch.

Evaluate the reviewer's VERDICT:

- **VERDICT: "pass"** — set card `status` to `"merging"`, proceed to Step 4

- **VERDICT: "fail"** and `card.fixCycleCount < state.config.maxFixCycles`:
  1. Send fix instructions to the SAME session via `oscr_follow_up` — include the reviewer's BLOCKING findings as the fix prompt
  2. Increment `card.fixCycleCount`
  3. Set card `status` to `"fixing"`
  4. Save state
  5. Return to Step 2 (wait for the fix to complete)

- **VERDICT: "fail"** and `card.fixCycleCount >= state.config.maxFixCycles`:
  - Set card `status` to `"escalated"`
  - Record reviewer notes on `card.reviewNotes`
  - Save state, continue to next card

---

### Step 4: Merge

1. Merge the worktree branch into baseBranch:

```bash
git merge {worktreeBranch} --no-ff -m "Merge {changeName} into {baseBranch}"
```

2. If `state.config.pushToRemote` is true:

```bash
git push origin {baseBranch}
```

3. **Update issue status to "done"** via MCP tool `update_issue`. VKB does NOT auto-transition issues — this must be explicit:

```
update_issue(issue_id=card.issueId, status_id=state.statusIds.done)
```

4. Set card `status` to `"done"`.

---

### Step 5: Checkpoint

1. Save state via `oscr_save`
2. Log a summary: card title, elapsed time, final status
3. Wait 60 seconds before processing the next card (prevents VKB rate issues and allows worktree cleanup)
4. Continue to the next card in the loop

---

## After All Cards

1. Set `state.phase` to `"finalize"`
2. Save state via `oscr_save`
3. Proceed to `oscr-finalize`

## Error Recovery

If the orchestrator restarts mid-execution, `oscr_load` restores state. Resume from the first card not in `"done"` or `"escalated"` status. Cards in `"launched"` or `"executing"` status should be checked via `GET {vkbBaseUrl}/api/tasks/{taskId}` to determine current state before re-entering the loop.
