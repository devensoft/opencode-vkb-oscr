# VKB-OSCR Command

Complete command reference for VKB-OSCR workflow.

## Usage

```
skill vkb-oscr-plan
skill vkb-oscr-coordinate
skill vkb-oscr-finalize
```

## Skills

### vkb-oscr-plan

Plan and set up OpenSpec-driven Vibe KanBan cards for a change request.

**When to use:**
- Starting a new change
- Parsing OpenSpec changes to identify phases
- Creating VKB cards with proper descriptions
- Setting up base branch and phase branches

**What it does:**
- Parses `openspec/changes/<name>/tasks.md` for phases
- Guides branch strategy selection
- Creates VKB cards with coordination instructions
- Sets up base branch

**Example:**
```bash
skill vkb-oscr-plan
```

Interactive session will ask:
1. Branch strategy (feature+phases, flat phases, long-running, custom)
2. Base branch name (if using feature branch strategy)
3. Executor preference (OPENCODE, CLAUDE_CODE, GEMINI, etc.)

**Output:**
- List of created cards with IDs
- Branch setup summary
- Next steps for coordination

### vkb-oscr-coordinate

Coordinate execution of OpenSpec-driven Vibe KanBan cards.

**When to use:**
- Monitoring card status and waiting for DONE
- Executing manual merge-back workflows
- Running tests and verification
- Handling tasks.md updates and conflicts
- Managing phase-to-phase transitions

**What it does:**
- Monitors card status until "done"
- Handles 60-second grace period
- Verifies branch HEADs
- Executes manual merges
- Resolves conflicts
- Runs configured tests
- Runs OpenSpec verification
- Updates tasks.md
- Pushes base branch

**Example:**
```bash
skill vkb-oscr-coordinate
```

Interactive session will configure:
1. Test framework (npm, Python, Rust, Go, Java, custom)
2. Custom test commands (if custom)
3. Baseline metrics file path

**Critical notes:**
- VKB does NOT auto-merge branches
- Always wait 60 seconds after "done" status
- Always run tests manually (VKB test results unreliable)
- Resolve tasks.md conflicts manually

### vkb-oscr-finalize

Finalize and archive OpenSpec change requests after all VKB phases complete.

**When to use:**
- All phase cards are done and merged
- Syncing delta specs to canonical specs
- Archiving the change
- Validating final implementation
- Deciding on main branch merge or PR creation

**What it does:**
- Runs final verification
- Syncs delta specs to canonical
- Archives completed change
- Runs final testing
- Guides merge or PR creation

**Example:**
```bash
skill vkb-oscr-finalize
```

**Workflow steps:**
1. Run `/opsx-verify <change-name>`
2. Handle blocking/non-blocking issues
3. Run `/opsx-sync <change-name>`
4. Run `/opsx-archive <change-name>`
5. Verify sync and archive
6. Push changes
7. Run final tests
8. Create PR or merge to main

## Common Workflows

### Complete OSCR Lifecycle

```bash
# 1. Create OpenSpec change
/opsx-new my-change

# 2. Plan VKB cards
skill vkb-oscr-plan
# → Creates cards for each phase

# 3. Coordinate each phase
skill vkb-oscr-coordinate
# → Repeat for each phase card

# 4. Finalize change
skill vkb-oscr-finalize
# → Sync, archive, and prepare merge
```

### Single-Phase Change

For simple changes with only one phase:

```bash
skill vkb-oscr-plan
# → Creates single card

skill vkb-oscr-coordinate
# → Coordinates execution

skill vkb-oscr-finalize
# → Finalizes and archives
```

### Multi-Phase Change

For complex changes with multiple phases:

```bash
skill vkb-oscr-plan
# → Creates cards: Phase 1, Phase 2, Phase 3

# Repeat coordination for each phase
skill vkb-oscr-coordinate  # Phase 1
skill vkb-oscr-coordinate  # Phase 2
skill vkb-oscr-coordinate  # Phase 3

# Finalize after all phases
skill vkb-oscr-finalize
```

## Tips

### Before Planning
- Ensure OpenSpec change exists at `openspec/changes/<name>/`
- Verify `tasks.md` has clear phase definitions
- Check VKB project is configured
- Verify git repo is clean

### During Coordination
- Always confirm "done" status twice with delay
- Never skip 60-second grace period
- Run tests manually, don't trust VKB results
- Document all merge conflicts

### During Finalization
- Ensure all phase cards show "done"
- Verify all phase branches merged to base
- Review verification output carefully
- Create follow-up cards for non-blocking issues

## Troubleshooting

### Plan Fails
- Check OpenSpec change structure
- Verify VKB project access
- Ensure git push permissions

### Coordinate Issues
- See [VKB Behavior Quirks](assets/skills/vkb-oscr-coordinate/references/vkb-behavior.md)
- Check branch status manually
- Review merge conflict resolution guide

### Finalization Errors
- Verify all phases complete
- Check spec state in `openspec/specs/`
- Review sync operation documentation
- Check archive directory permissions

## Reference Documentation

Each skill includes comprehensive reference documentation:

**vkb-oscr-plan:**
- [Branching Strategies](assets/skills/vkb-oscr-plan/references/branching-strategies.md)
- [Card Template Examples](assets/skills/vkb-oscr-plan/references/card-template-examples.md)
- [VKB API Quick Reference](assets/skills/vkb-oscr-plan/references/vkb-api-quickref.md)

**vkb-oscr-coordinate:**
- [Merge Conflict Resolution](assets/skills/vkb-oscr-coordinate/references/merge-conflict-resolution.md)
- [Testing Baseline](assets/skills/vkb-oscr-coordinate/references/testing-baseline.md)
- [Verification Guide](assets/skills/vkb-oscr-coordinate/references/verification-guide.md)
- [VKB Behavior](assets/skills/vkb-oscr-coordinate/references/vkb-behavior.md)

**vkb-oscr-finalize:**
- [Archive Process](assets/skills/vkb-oscr-finalize/references/archive-process.md)
- [Post-Completion Checklist](assets/skills/vkb-oscr-finalize/references/post-completion-checklist.md)
- [Sync Operations](assets/skills/vkb-oscr-finalize/references/sync-operations.md)

## Additional Resources

- [README.md](../README.md) - Project overview and features
- [INSTALLATION.md](../INSTALLATION.md) - Installation instructions
- [AGENTS.md](../AGENTS.md) - AI agent guidelines
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Development workflow
- [CHANGELOG.md](../CHANGELOG.md) - Version history
