---
name: oscr-plan
description: Phase 1 planning workflow for OSCR. Creates VKB kanban issues and cards for each OpenSpec change, preparing for execution. Use after oscr-intake completes Phase 0.
license: MIT
compatibility: opencode
---

# OSCR Plan (Phase 1)

Create VKB kanban issues and prepare card state for each change name.

## Prerequisite

Load state via `oscr_load`. Verify `phase` is `"intake"` or `"plan"`.

## Step 1: Get Change Instructions

For each change name in `state.changeNames`:

```bash
openspec instructions <change-name> --json
```

Parse the JSON output. This contains the implementation instructions, acceptance criteria, and context that will populate the card template.

## Step 2: Create Kanban Issue

For each change, create a kanban issue on the remote project via MCP tool `create_issue`.

Required fields (all must be present even if null):

```json
{
  "project_id": "<state.config.remoteProjectId>",
  "status_id": "<state.statusIds.todo>",
  "title": "<short descriptive title from change spec>",
  "description": null,
  "priority": "urgent",
  "start_date": null,
  "target_date": null,
  "completed_at": null,
  "sort_order": 0,
  "parent_issue_id": null,
  "parent_issue_sort_order": null,
  "extension_metadata": null
}
```

**Response is double-nested**: extract issue ID from `resp.data.data.id`.

## Step 3: Build Card State

For each change, create a `CardState` entry:

```json
{
  "changeName": "<change-name>",
  "cardTitle": "<short title generated in step 2>",
  "issueId": "<from step 2>",
  "taskId": null,
  "workspaceId": null,
  "sessionId": null,
  "startTime": null,
  "status": "pending",
  "fixCycleCount": 0,
  "nudgeSent": false,
  "worktreeBranch": null,
  "reviewNotes": null
}
```

Generate the card title as a concise, descriptive summary derived from the change spec (e.g. "Add JWT authentication middleware").

## Step 4: Save State

1. Set `state.cards` to the array of `CardState` entries
2. Set `state.phase` to `"execute"`
3. Set `state.lastCheckpoint` to current timestamp
4. Save via `oscr_save`

After saving, proceed to `oscr-execute`.
