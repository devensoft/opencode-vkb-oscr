# Changelog

All notable changes to the opencode-vkb-oscr plugin.

## [0.1.0] - 2026-02-12

### Added
- Initial release of VKB-OSCR workflow plugin
- `vkb-oscr-plan` skill for planning OpenSpec changes and creating VKB cards
- `vkb-oscr-coordinate` skill for coordinating phase execution
- `vkb-oscr-finalize` skill for completing and archiving changes
- Support for 4 branching strategies (feature branch + phases, flat phases, long-running feature, custom)
- Multi-framework testing support (npm, Python, Rust, Go, Java)
- Comprehensive reference documentation for all skills
- VKB behavior quirks documentation and workarounds
- Merge conflict resolution guides
- Testing baseline metrics (BL-004)
- OpenSpec verification guidance
- Archive process documentation
- Post-completion checklists

### Features
- Interactive planning session with branch strategy selection
- 60-second grace period handling for VKB late commits
- Manual merge workflow with conflict resolution
- Delta spec sync with atomic operations (ADDED, MODIFIED, REMOVED, RENAMED)
- Timestamp-based archiving
- Follow-up card creation for non-blocking issues
- Baseline test result comparison

### Documentation
- Complete README with usage examples
- AGENTS.md with development guidelines
- CONTRIBUTING.md with setup and workflow
- INSTALLATION.md with multiple installation methods
- Skill reference documentation:
  - Branching strategies guide
  - Card template examples
  - VKB API quick reference
  - Merge conflict resolution
  - Testing baseline metrics
  - Verification guide
  - VKB behavior quirks
  - Sync operations
  - Archive process
  - Post-completion checklist
