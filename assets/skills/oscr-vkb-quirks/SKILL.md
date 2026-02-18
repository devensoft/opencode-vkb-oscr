---
name: oscr-vkb-quirks
description: Reference for VKB API quirks, known bugs, and workarounds. Load this before any VKB HTTP API interaction to avoid silent failures.
license: MIT
compatibility: opencode
---

# VKB API Quirks and Workarounds

Load this skill before any VKB HTTP API interaction. These quirks cause silent failures if not handled.

## 1. Descriptions Are Not Passed to Executors

`description: null` on all tasks. The `task.description` field in `create-and-start` is ignored by executors. **Always use the follow-up API** (`POST /api/sessions/{id}/follow-up`) to send instructions immediately after creating a task.

## 2. Two Project Systems

VKB has "remote projects" (kanban/issues) and legacy task projects. They are separate:

- **Remote projects**: used for `create_issue`, `update_issue`, issue tracking
- **Legacy task project**: used for `create-and-start` only

The `create-and-start` endpoint requires the legacy project ID:
```
a049fb72-64c9-4ecb-bb69-e091ddcd8c3e
```

Do NOT use the remote project ID for `create-and-start`.

## 3. Issue Create Requires Full Body

All fields are required in the `create_issue` request body, even if null:

```json
{
  "project_id": "...",
  "status_id": "...",
  "title": "...",
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

**Response is double-nested**: extract issue ID from `resp.data.data.id`, not `resp.data.id`.

## 4. executor_profile_id Format Differs by Endpoint

- **For follow-up** (`POST /api/sessions/{id}/follow-up`):
  ```json
  { "executor": "OPENCODE" }
  ```

- **For create-and-start** (`POST /api/tasks/create-and-start`):
  ```json
  { "executor": "OPENCODE", "variant": null }
  ```

Omitting `variant` on create-and-start causes a 422 error.

## 5. No Auto-Transition to Done

VKB does NOT automatically update kanban issue status when a task completes. **Always explicitly update issue status** to "done" via MCP tool `update_issue` after a successful merge.

## 6. Task Description Field Ignored

The `description` field on `create-and-start` is never shown to the executor agent. The ONLY way to deliver implementation instructions is via the follow-up API. Send the follow-up immediately after `create-and-start` returns.

## 7. Completion Signal

`has_in_progress_attempt === false` is the reliable completion indicator. Do NOT rely on the `status` field — it may show "inprogress" even after the executor has finished. The `oscr_wait` tool already uses this signal.

## 8. Follow-Up Reactivates Tasks

Sending a follow-up to a task in "inreview" status transitions it back to "inprogress" with `has_in_progress_attempt: true`. This is intentional for fix cycles but can cause confusion if sent accidentally. Only send follow-ups when you intend to restart execution.

## 9. Queue API Is Broken

`POST /api/sessions/{id}/queue` returns 422. Do not use it. Use follow-up instead.

## 10. Working API Routes

Verified routes:

| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/info` | Server info |
| GET | `/api/health` | Health check |
| GET | `/api/repos` | List repositories |
| GET | `/api/tasks?project_id=...` | List tasks |
| POST | `/api/tasks/create-and-start` | Create and launch task |
| GET | `/api/tasks/{id}` | Get task status |
| GET | `/api/task-attempts?task_id=...` | Get task attempts |
| GET | `/api/sessions?workspace_id=...` | Get sessions |
| POST | `/api/sessions/{id}/follow-up` | Send follow-up |
| GET | `/api/remote/issues` | List issues |
| GET | `/api/remote/issues/{id}` | Get issue |
| GET | `/api/remote/projects` | List remote projects |
| GET | `/api/remote/project-statuses?project_id=...` | Get status options |

Routes NOT listed here are unverified and may not work.
