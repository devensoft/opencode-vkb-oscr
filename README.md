# VKB-OSCR Workflow

Complete OpenSpec Change Request (OSCR) workflow for Vibe KanBan with card planning, execution coordination, and finalization.

## Overview

The VKB-OSCR workflow provides three coordinated skills for managing OpenSpec change requests through Vibe KanBan:

- **vkb-oscr-plan**: Parse OpenSpec changes and create VKB cards with proper phase planning
- **vkb-oscr-coordinate**: Coordinate execution, handle merges, run tests, and manage phase transitions
- **vkb-oscr-finalize**: Complete changes, sync specs, archive, and prepare for merge

## Usage

### Planning a Change

```bash
skill vkb-oscr-plan
```

Start by defining a new OpenSpec change, then use this skill to:
- Parse `openspec/changes/<name>/tasks.md` for phases
- Choose branching strategy (feature branch + phase branches recommended)
- Set base branch name and executor preference
- Create VKB cards for each phase with detailed instructions

**Example:**
```
Change: user-authentication-v2
Tasks.md: 3 phases identified
Strategy: Feature branch + phase branches
Base Branch: feature/user-auth-v2
Cards Created: 3
  - Phase 1: Database Schema
  - Phase 2: API Endpoints
  - Phase 3: Frontend Integration
```

### Coordinating Phase Execution

```bash
skill vkb-oscr-coordinate
```

After planning, coordinate each phase:

1. Monitor card status until "done"
2. Wait 60-second grace period (VKB may commit late changes)
3. Verify branch HEADs
4. Manually merge phase to base if needed
5. Resolve conflicts (especially in tasks.md)
6. Run configured tests (npm, pytest, cargo, etc.)
7. Run `/opsx-verify` for OpenSpec verification
8. Update tasks.md
9. Push base branch

**Critical Notes:**
- VKB does NOT auto-merge branches
- VKB test results are unreliable—always run tests manually
- The 60-second grace period is critical to avoid missing late commits

**Example:**
```
Phase: 1 - Database Schema
Card: abc123
Status: done (confirmed after grace period)
Merge: phase/1-db-schema → feature/user-auth-v2
Tests: 142 passed (baseline 140, +2 acceptable)
Verification: PASS
tasks.md: Updated with completion notes
```

### Finalizing a Change

```bash
skill vkb-oscr-finalize
```

After all phases complete:

1. Run final `/opsx-verify`
2. Handle any blocking or non-blocking issues
3. Run `/opsx-sync` to merge delta specs to canonical
4. Run `/opsx-archive` to move change to archive
5. Verify sync and archive success
6. Push changes
7. Run final testing against baseline
8. Decide on merge to main, PR creation, or tag release

**Example:**
```
Change: user-authentication-v2
Phases: 3 completed
Verification: PASS
Sync: 12 specs applied (3 added, 6 modified, 1 removed, 2 renamed)
Archive: openspec/changes/archive/2026-02-12-user-authentication-v2/
Tests: Unit 142/140, E2E 85/81, Build 312KB (baseline 307KB)
Action: Creating PR to main
```

## Requirements

- OpenCode plugin framework installed
- Vibe KanBan configured with repositories
- Git repository with push access
- OpenSpec change structure at `openspec/changes/<name>/`

## Features

### Branching Strategy Support

Four branching strategies:
- **Feature branch + phase branches** (recommended) - Clean history, easy coordination
- **Flat phase branches** - Independent phases, simple structure
- **Long-running feature branch** - Single branch with phase tags
- **Custom** - User-defined approaches

### Multi-Framework Testing

Supports multiple test frameworks with baseline comparison:
- npm/Node.js (jest, vitest, playwright)
- Python (pytest)
- Rust (cargo)
- Go (go test)
- Java/Maven

### VKB Behavior Handling

Documented workarounds for VKB quirks:
- Status unreliability (confirm "done" twice with delay)
- No auto-merge (manual merge required)
- Late commits (60-second grace period)
- Unreliable tests (always run manually)
- tasks.md conflicts (resolution guide)

### Comprehensive References

Each skill includes detailed reference documentation:
- Branching strategies and decision guides
- Card template examples for different phase types
- VKB API quick reference
- Merge conflict resolution patterns
- Testing baseline metrics (BL-004)
- OpenSpec verification guide
- VKB behavior quirks documentation
- Sync operation details
- Archive process documentation
- Post-completion checklists

## How It Works

1. **Planning Phase**
   - Parse OpenSpec change artifacts
   - Extract phases from tasks.md
   - Interactive branching strategy selection
   - Create VKB cards with detailed coordination instructions
   - Set up base branch

2. **Coordination Phase**
   - Monitor card completion
   - Handle 60-second grace period
   - Verify branch state
   - Execute manual merges
   - Resolve conflicts
   - Run tests and verification
   - Manage phase-to-phase transitions

3. **Finalization Phase**
   - Comprehensive verification
   - Sync delta specs to canonical
   - Archive completed changes
   - Final testing and validation
   - Prepare merge or PR

## Troubleshooting

### VKB Status Won't Change to "done"

If VKB appears stuck:
1. Check branch directly for new commits
2. Review VKB output for errors
3. Consider creating new card with clearer instructions

### Merge Conflicts in tasks.md

Tasks.md conflicts are common. Resolution principles:
- Keep most complete version (usually phase branch)
- Preserve completed task markers [x]
- Merge task descriptions if both changed
- When in doubt, keep more information

See [merge-conflict-resolution.md](assets/skills/vkb-oscr-coordinate/references/merge-conflict-resolution.md) for detailed examples.

### Verification Fails

If `/opsx-verify` finds issues:
1. Classify as blocking or non-blocking
2. Blocking issues: Fix in current phase before proceeding
3. Non-blocking issues: Document and create follow-up card
4. Re-run verification after fixes

### Sync Operation Fails

If `/opsx-sync` fails:
1. Read error message for specific failure
2. Check spec state in canonical directory
3. Resolve conflicts (target exists for ADDED, target missing for MODIFIED, etc.)
4. Re-run sync after resolving

See [sync-operations.md](assets/skills/vkb-oscr-finalize/references/sync-operations.md) for resolution guidance.

## Development

For development instructions, see [CONTRIBUTING.md](CONTRIBUTING.md).

For AI agent guidelines, see [AGENTS.md](AGENTS.md).

For installation instructions, see [INSTALLATION.md](INSTALLATION.md).

## License

MIT - See [LICENSE](LICENSE) file.
