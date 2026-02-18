# Changelog

All notable changes to the opencode-vkb-oscr plugin.

## [0.9.1] - 2026-02-18

### Added

**Agents**
- `vibe-orchestrator` — Primary orchestrator agent with skill-based phase loading
- `oscr-reviewer` — Hidden read-only code reviewer subagent
- `oscr-verifier` — Hidden test/verification subagent

**Skills**
- `oscr-intake` — Phase 0: Interactive Q&A via octto
- `oscr-plan` — Phase 1: Create VKB cards for each change
- `oscr-execute` — Phase 2: 5-step execution loop (launch, wait, review, fix, merge)
- `oscr-finalize` — Phase 3: Sync, verify, archive
- `oscr-vkb-quirks` — Reference documentation for VKB API quirks

**Custom Tools**
- `oscr_save` — Persist orchestration state to `.opencode/.oscr-state.json`
- `oscr_load` — Load persisted state from disk
- `oscr_wait` — Server-side polling with timeout (prevents LLM context explosion)
- `oscr_follow_up` — Send instructions to VKB executor sessions

**Commands**
- `/oscr` — Full workflow orchestration
- `/oscr-plan` — Planning phase only
- `/oscr-exec` — Resume execution from saved state
- `/oscr-fin` — Finalization phase only
- `/oscr-status` — Read-only status display

**Templates**
- `card-template.md` — User-modifiable instructions for VKB executors

### Changed
- Complete architecture redesign: replaced 3 monolithic skills with 5 focused skills + 3 agents
- Plugin now exports `tool`, `config`, and `event` hooks
- Config hook installs agents, skills, commands, and templates
- Added `main` and `exports` fields to package.json for broader compatibility
- State management now uses custom tools instead of inline logic
- Execution loop uses server-side polling to prevent context explosion

### Removed
- `vkb-oscr-plan` skill (replaced by `oscr-plan`)
- `vkb-oscr-coordinate` skill (replaced by `oscr-execute`)
- `vkb-oscr-finalize` skill (replaced by `oscr-finalize`)
- `vkb-oscr` command (replaced by 5 focused commands)
- All reference documentation (consolidated into skills)

### Migration Notes
- Skills renamed: `vkb-oscr-*` → `oscr-*`
- Commands renamed: `/vkb-oscr` → `/oscr`, `/oscr-plan`, `/oscr-exec`, `/oscr-fin`, `/oscr-status`
- Primary interaction now via `@vibe-orchestrator` agent instead of direct skill loading
- State file moved: `.opencode/vkb-oscr-installed` → `.opencode/.oscr-installed`

## [0.1.0] - 2026-02-12

### Added
- Initial release of VKB-OSCR workflow plugin
- `vkb-oscr-plan` skill for planning OpenSpec changes
- `vkb-oscr-coordinate` skill for coordinating phase execution
- `vkb-oscr-finalize` skill for completing and archiving changes
- Support for 4 branching strategies
- Multi-framework testing support
- Comprehensive reference documentation
