---
name: vkb-oscr-plan
description: Plan and set up OpenSpec-driven Vibe KanBan cards for a change request. Use when (1) starting a new change, (2) parsing OpenSpec changes to identify phases, (3) creating VKB cards with proper descriptions, (4) setting up base branch and phase branches. Guides through branch strategy selection, phase identification from tasks.md, and card creation with templates that include testing protocols and merge-back instructions.
license: MIT
compatibility: opencode
metadata:
  category: workflow
  workflow: vkb-oscr
---

# VKB-OSCR Planning Skill

## Overview

This skill guides you through the **planning phase** of the OpenSpec Change Request (OSCR) workflow. It helps transform an OpenSpec change artifact into actionable Vibe KanBan (VKB) cards with proper coordination rules, branch setup, and phase planning.

**What this skill does:**
- Parses OpenSpec change artifacts to extract phases
- Sets up branching strategy for coordinated development
- Creates VKB cards with detailed implementation guidance
- Establishes coordinator-VKD handoff protocols

## Prerequisites

Before starting, verify:

- [ ] OpenSpec change exists at `openspec/changes/<name>/` with `tasks.md`
- [ ] VKB project is configured with repositories
- [ ] Git repo is clean (no uncommitted changes on main)
- [ ] You have push access to create branches

## Interactive Planning Session

Start an interactive session to gather planning parameters:

```python
# Use octto tools to collect user preferences:
# 1. start_session with questions array
# 2. pick_one for branch strategy
# 3. ask_text for branch name
# 4. pick_one for executor preference
```

### Question 1: Branch Strategy

**Ask:** "How would you like to handle branching for this change?"

**Options:**
- **A) Feature branch + phase branches** (recommended): Create a base branch from main, with phase branches merging back to base
- **B) Flat phase branches**: Each phase branches independently from main
- **C) Long-running feature branch**: Single branch with phase tags
- **D) Custom**: User describes their approach

**Recommendation:** Option A provides the best coordination for multi-phase changes.

See [references/branching-strategies.md](references/branching-strategies.md) for detailed explanations.

### Question 2: Base Branch Name

**Ask (if A or C selected):** "What should the base/feature branch be named?"

**Suggest formats:**
- `feature/<change-name>`
- `oscr/<change-name>`
- `change/<change-name>`

**Example:** For change "user-auth-refactor", suggest `feature/user-auth-refactor`

### Question 3: Executor Preference

**Ask:** "Which AI executor should run the workspace sessions?"

**Options:**
- OPENCODE (default)
- CLAUDE_CODE
- GEMINI
- CODEX
- CURSOR_AGENT

## Workflow Steps

After collecting user preferences, execute these steps:

### Step 1: Parse OpenSpec Change

1. Read `openspec/changes/<name>/tasks.md`
2. Identify phases and their sub-tasks
3. Count total phases
4. Note any phase dependencies (e.g., "Phase 2 depends on Phase 1")
5. Extract acceptance criteria if present

**Phase identification pattern:**
```markdown
# Phase 1: Setup and Configuration
## Tasks
- [ ] Task 1
- [ ] Task 2

# Phase 2: Implementation
## Tasks
- [ ] Task 3
- [ ] Task 4
```

### Step 2: Get VKB Project Information

Use VKB MCP tools to retrieve:

```
vibe_kanban_list_projects       → Get available projects
vibe_kanban_list_repos          → Get repos for selected project
```

Record:
- `project_id` for card creation
- `repo_id` for branch context
- Project name for reference

### Step 3: Create Base Branch

If using strategy A or C:

```bash
git checkout main
git pull origin main
git checkout -b <base-branch-name>
git push -u origin <base-branch-name>
```

Verify branch exists on remote before proceeding.

### Step 4: Create Phase Cards

For each phase identified in Step 1:

1. **Generate card title:** `Phase N: <Phase Name>`

2. **Build description** using the template below

3. **Create card** via VKB API:
   ```
   vibe_kanban_create_task(
     title="Phase N: <Phase Name>",
     description="<generated description>",
     project_id="<from step 2>",
     status="TODO"
   )
   ```

4. **Record card ID** for summary output

## Card Description Template

Use this template for each phase card:

```markdown
## Phase N: <Phase Name>

### Implementation Tasks
<!-- List from tasks.md -->
- [ ] Task 1
- [ ] Task 2
...

### Important OSCR Coordination Notes

**VKD Agent Instructions:**
- ✅ Implement tasks only in phase branch
- ✅ Commit frequently and update `tasks.md` in phase branch
- ❌ Do NOT attempt to merge to base branch
- ❌ Do NOT attempt to update other card branches
- ❌ Do NOT attempt to fix cross-card conflicts

**Coordinator Actions (after card is DONE):**
1. Wait 60-second grace period
2. Verify phase branch HEAD is stable (check vk/* branches too)
3. Manually merge phase branch to base if needed
4. Resolve tasks.md conflicts if present
5. Run tests + verification manually
6. Push base branch before creating next card

### Testing Protocol
Run after implementation:
- `npm run test` (or your test command)
- `npm run test:e2e` (if applicable)
- `npm run build`
- `npm run lint`

### Non-Blocking Issues
If non-blocking issues are found:
- Create follow-up card in TODO status
- Include issue description and file reference
- Continue with current phase completion

### Merge-Back Instructions
This phase branch should be merged to base after completion.
VKB will NOT auto-merge - coordinator must manually merge.
```

See [references/card-template-examples.md](references/card-template-examples.md) for examples of different phase types.

## Output Summary

After all cards are created, provide:

```markdown
## Planning Complete ✓

### Created Cards
| Phase | Card ID | Title |
|-------|---------|-------|
| 1 | <id> | Phase 1: <Name> |
| 2 | <id> | Phase 2: <Name> |
| ... | ... | ... |

### Branch Setup
- **Strategy:** <A/B/C/D>
- **Base Branch:** <branch-name>
- **Phase Branches:** Will be created as `phase/<n>-<name>`

### Next Steps
1. Run `skill vkb-oscr-coordinate` to begin execution
2. Or use VKB CLI: `vkb card start <card-id>` to begin Phase 1

### Reference Files
- [Branching Strategies](references/branching-strategies.md)
- [Card Template Examples](references/card-template-examples.md)
- [VKB API Quick Reference](references/vkb-api-quickref.md)
```

## Reference Files

- [references/branching-strategies.md](references/branching-strategies.md) - Detailed branching strategy explanations
- [references/card-template-examples.md](references/card-template-examples.md) - Example cards for different phase types
- [references/vkb-api-quickref.md](references/vkb-api-quickref.md) - VKB MCP function reference
