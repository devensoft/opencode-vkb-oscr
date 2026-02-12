# VKB API Quick Reference

Quick reference for Vibe KanBan MCP functions used in OSCR workflow.

---

## Projects

### vibe_kanban_list_projects

List all available VKB projects.

**Usage:**
```json
{
  "tool": "vibe_kanban_list_projects"
}
```

**Returns:**
```json
{
  "projects": [
    {
      "id": "proj_abc123",
      "name": "My Project",
      "description": "Project description"
    }
  ]
}
```

**When to use:** At start of planning to identify target project.

---

### vibe_kanban_get_project

Get details for a specific project.

**Usage:**
```json
{
  "tool": "vibe_kanban_get_project",
  "arguments": {
    "project_id": "proj_abc123"
  }
}
```

**Returns:** Project details including repos, boards, settings.

---

## Repositories

### vibe_kanban_list_repos

List repositories for a project.

**Usage:**
```json
{
  "tool": "vibe_kanban_list_repos",
  "arguments": {
    "project_id": "proj_abc123"
  }
}
```

**Returns:**
```json
{
  "repos": [
    {
      "id": "repo_def456",
      "name": "my-app",
      "url": "https://github.com/user/repo",
      "default_branch": "main"
    }
  ]
}
```

**When to use:** After selecting project to identify target repo.

---

## Cards (Tasks)

### vibe_kanban_create_task

Create a new card/task.

**Usage:**
```json
{
  "tool": "vibe_kanban_create_task",
  "arguments": {
    "title": "Phase 1: Setup",
    "description": "## Phase 1...",
    "project_id": "proj_abc123",
    "status": "TODO",
    "labels": ["oscr", "phase-1"],
    "priority": "high"
  }
}
```

**Required fields:**
- `title`: Card title
- `description`: Markdown description
- `project_id`: Target project ID

**Optional fields:**
- `status`: TODO, IN_PROGRESS, DONE (default: TODO)
- `labels`: Array of label strings
- `priority`: low, medium, high, critical
- `assignee`: User ID
- `due_date`: ISO 8601 date string

**Returns:**
```json
{
  "task": {
    "id": "task_xyz789",
    "title": "Phase 1: Setup",
    "status": "TODO",
    "url": "https://vkb.example.com/cards/task_xyz789"
  }
}
```

**When to use:** Creating phase cards after parsing OpenSpec change.

---

### vibe_kanban_get_task

Get card details.

**Usage:**
```json
{
  "tool": "vibe_kanban_get_task",
  "arguments": {
    "task_id": "task_xyz789"
  }
}
```

**When to use:** Checking card status before coordination.

---

### vibe_kanban_update_task

Update card details.

**Usage:**
```json
{
  "tool": "vibe_kanban_update_task",
  "arguments": {
    "task_id": "task_xyz789",
    "status": "IN_PROGRESS",
    "description": "Updated description..."
  }
}
```

**When to use:** Updating card status during coordination.

---

### vibe_kanban_list_tasks

List cards in a project.

**Usage:**
```json
{
  "tool": "vibe_kanban_list_tasks",
  "arguments": {
    "project_id": "proj_abc123",
    "status": "TODO",
    "labels": ["oscr"]
  }
}
```

**When to use:** Finding existing OSCR cards.

---

## Workspaces (Sessions)

### vibe_kanban_create_workspace

Create a VKD workspace session for a card.

**Usage:**
```json
{
  "tool": "vibe_kanban_create_workspace",
  "arguments": {
    "task_id": "task_xyz789",
    "executor": "OPENCODE",
    "branch": "phase/1-setup",
    "base_branch": "feature/my-change",
    "context": {
      "change_name": "my-change",
      "phase": 1,
      "phase_name": "Setup"
    }
  }
}
```

**Required fields:**
- `task_id`: Card to work on
- `executor`: AI executor (OPENCODE, CLAUDE_CODE, etc.)

**Optional fields:**
- `branch`: Phase branch name
- `base_branch`: Base/feature branch name
- `context`: Additional context object

**Returns:**
```json
{
  "workspace": {
    "id": "ws_abc123",
    "status": "created",
    "url": "https://vkb.example.com/workspaces/ws_abc123"
  }
}
```

**When to use:** In coordination phase to start VKD execution.

---

### vibe_kanban_get_workspace

Get workspace details.

**Usage:**
```json
{
  "tool": "vibe_kanban_get_workspace",
  "arguments": {
    "workspace_id": "ws_abc123"
  }
}
```

**When to use:** Checking workspace status during coordination.

---

## Common Patterns

### Pattern 1: Full Planning Flow

```
1. vibe_kanban_list_projects
2. vibe_kanban_list_repos (for selected project)
3. (Parse OpenSpec change)
4. vibe_kanban_create_task (for each phase)
5. Return card IDs
```

### Pattern 2: Coordination Flow

```
1. vibe_kanban_get_task (check current status)
2. vibe_kanban_create_workspace (start VKD)
3. (Wait for VKD completion)
4. vibe_kanban_get_workspace (verify completion)
5. (Manual merge if needed)
6. vibe_kanban_update_task (mark DONE)
```

### Pattern 3: Status Check

```
1. vibe_kanban_list_tasks (filter by project + labels)
2. For each relevant task:
   - vibe_kanban_get_task (detailed status)
```

---

## Error Handling

Common errors and responses:

| Error | Cause | Solution |
|-------|-------|----------|
| `project_not_found` | Invalid project_id | Re-run list_projects |
| `task_not_found` | Invalid task_id | Check task list |
| `invalid_status` | Wrong status value | Use TODO/IN_PROGRESS/DONE |
| `workspace_failed` | VKD executor error | Check workspace logs |

---

## Rate Limits

Typical limits (verify with your VKB instance):
- List operations: 100/minute
- Create operations: 30/minute
- Update operations: 60/minute

**Best practice:** Cache project/repo IDs during planning phase.
