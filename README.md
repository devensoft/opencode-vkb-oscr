# OpenCode VKB-OSCR Plugin

Orchestrate OpenSpec Change Requests through Vibe-Kanban with a 4-phase workflow: intake → plan → execute → finalize.

## Overview

This plugin provides a complete orchestration system for managing OpenSpec change requests by delegating implementation work to Vibe-Kanban (VKB) executor agents.

### Components

| Component      | Name                | Description                                          |
| -------------- | ------------------- | ---------------------------------------------------- |
| **Agent**      | vibe-orchestrator   | Primary orchestrator — loads skills per phase        |
| **Subagent**   | oscr-reviewer       | Read-only code reviewer for worktree output          |
| **Subagent**   | oscr-verifier       | Test/verification runner for worktree output         |
| **Skill**      | oscr-intake         | Phase 0: Interactive Q&A via octto                   |
| **Skill**      | oscr-plan           | Phase 1: Create VKB cards for each change            |
| **Skill**      | oscr-execute        | Phase 2: Launch, wait, review, fix, merge            |
| **Skill**      | oscr-finalize       | Phase 3: Sync, verify, archive                       |
| **Skill**      | oscr-vkb-quirks     | Reference: VKB API quirks and workarounds            |
| **Tool**       | oscr_save           | Persist orchestration state to disk                  |
| **Tool**       | oscr_load           | Load persisted state from disk                       |
| **Tool**       | oscr_wait           | Server-side poll with timeout (prevents context explosion) |
| **Tool**       | oscr_follow_up      | Send instructions to VKB executor sessions           |
| **Template**   | card-template.md    | User-modifiable instructions for VKB executors       |

## Usage

### Primary Entry Point

Invoke the orchestrator agent directly:

```
@vibe-orchestrator implement openspec active changes
```

Or use a slash command:

```
/oscr user-authentication-v2
/oscr active
```

### Slash Commands

| Command        | Description                                    |
| -------------- | ---------------------------------------------- |
| `/oscr`        | Full workflow (intake → plan → execute → finalize) |
| `/oscr-plan`   | Planning phase only — creates VKB cards        |
| `/oscr-exec`   | Resume execution from saved state              |
| `/oscr-fin`    | Finalization phase only — sync and archive     |
| `/oscr-status` | Show current orchestration status (read-only)  |

### Change Name Input

The orchestrator accepts:
- **Single change**: `@vibe-orchestrator implement user-auth-v2`
- **Multiple changes**: `@vibe-orchestrator implement auth,logging,cache`
- **All active**: `@vibe-orchestrator implement active` (uses `openspec status --json`)

## Workflow Phases

### Phase 0: Intake (`oscr-intake`)

Interactive confirmation via octto:
1. Determine change names from input
2. Infer VKB server URL from opencode.json MCP config
3. Confirm push preference (local vs remote)
4. Choose executor model (OPENCODE, CLAUDE, CODEX, etc.)
5. Validate changes exist and are active
6. Save initial state

### Phase 1: Plan (`oscr-plan`)

Create VKB cards:
1. Load state
2. For each change: get instructions via `openspec instructions --json`
3. Create kanban issue via MCP `create_issue`
4. Build CardState entries with "pending" status
5. Save state, transition to execute phase

### Phase 2: Execute (`oscr-execute`)

The 5-step execution loop per card:

**Step 1: Create & Launch**
- Call VKB `create-and-start` API
- Get session ID
- Immediately send follow-up with rendered card template

**Step 2: Wait for Completion**
- Poll via `oscr_wait` (server-side, prevents context explosion)
- Completion signal: `has_in_progress_attempt === false`
- Stall handling: nudge once, escalate on second timeout

**Step 3: Review**
- Invoke `@oscr-reviewer` subagent
- If blocking issues and fix cycles remaining: send fix instructions via follow-up
- Loop back to Step 2

**Step 4: Merge**
- `git merge {branch} --no-ff` into base
- Push to remote if configured
- Explicitly update issue status to "done"

**Step 5: Checkpoint**
- Save state, log summary, continue to next card

### Phase 3: Finalize (`oscr-finalize`)

For each completed card:
1. `openspec sync <change>`
2. `openspec verify <change>`
3. `openspec archive <change>`
4. Generate summary report
5. Clean up state file

## Requirements

- **OpenCode** with plugin support
- **Bun** runtime (v1.0.0+)
- **Vibe KanBan** configured with repositories
- **OpenSpec** project structure at `openspec/changes/`
- **octto** plugin (for Phase 0 interactive Q&A)

## Installation

Add to your project's `.opencode/opencode.json`:

```json
{
  "plugins": [
    "opencode-vkb-oscr"
  ]
}
```

The plugin's config hook installs:
- Agents to `.opencode/agents/`
- Skills to `.opencode/skills/`
- Commands to `.opencode/commands/`
- Templates to `.opencode/templates/`

See [INSTALLATION.md](INSTALLATION.md) for detailed instructions.

## VKB API Quirks

The plugin handles these known VKB behaviors (documented in `oscr-vkb-quirks` skill):

- **Descriptions not passed to executors** — always use follow-up API
- **Two project systems** — legacy for tasks, remote for issues
- **No auto-transition to Done** — explicitly update status after merge
- **Completion signal** — `has_in_progress_attempt === false` is more reliable than status

## Development

- [CONTRIBUTING.md](CONTRIBUTING.md) — Setup and workflow
- [AGENTS.md](AGENTS.md) — Guidelines for AI agents
- [CHANGELOG.md](CHANGELOG.md) — Version history

## License

MIT — See [LICENSE](LICENSE) file.
