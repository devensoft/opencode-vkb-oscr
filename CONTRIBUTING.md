# Contributing to opencode-vkb-oscr

Thank you for contributing to the VKB-OSCR orchestration plugin!

## Setup

```bash
git clone <repository-url>
cd opencode-vkb-oscr
bun install
bun run check    # Type check
bun test         # Run tests
```

## Package Structure

```
opencode-vkb-oscr/
├── src/                        # TypeScript source
│   ├── types.ts                # All interfaces and types
│   └── tools/                  # Custom tool implementations
│       ├── state.ts            # oscr_save, oscr_load
│       ├── wait.ts             # oscr_wait
│       └── vkb.ts              # oscr_follow_up
├── assets/                     # Plugin assets (copied on install)
│   ├── agents/                 # Agent definitions
│   │   ├── vibe-orchestrator.md
│   │   ├── oscr-reviewer.md
│   │   └── oscr-verifier.md
│   ├── skills/                 # Skill definitions
│   │   ├── oscr-intake/
│   │   ├── oscr-plan/
│   │   ├── oscr-execute/
│   │   ├── oscr-finalize/
│   │   └── oscr-vkb-quirks/
│   ├── commands/               # Slash commands
│   │   ├── oscr.md
│   │   ├── oscr-plan.md
│   │   ├── oscr-exec.md
│   │   ├── oscr-fin.md
│   │   └── oscr-status.md
│   └── templates/              # User-modifiable templates
│       └── card-template.md
├── tests/                      # Test files
│   └── unit/
│       └── plugin.test.ts
├── plugin.ts                   # Main plugin (tool, config, event exports)
├── index.ts                    # Package entry point
├── package.json
└── tsconfig.json
```

## Architecture

### 4-Phase Workflow

1. **Intake** (`oscr-intake`) — Interactive Q&A via octto
2. **Plan** (`oscr-plan`) — Create VKB cards
3. **Execute** (`oscr-execute`) — Launch, wait, review, fix, merge
4. **Finalize** (`oscr-finalize`) — Sync, verify, archive

### Agents

- `vibe-orchestrator` — Primary agent, loads skills per phase
- `oscr-reviewer` — Hidden subagent for code review (read-only)
- `oscr-verifier` — Hidden subagent for test verification

### Custom Tools

- `oscr_save` — Persist state to `.opencode/.oscr-state.json`
- `oscr_load` — Load persisted state
- `oscr_wait` — Server-side polling (prevents context explosion)
- `oscr_follow_up` — Send instructions to VKB sessions

## Making Changes

### Adding a New Skill

1. Create `assets/skills/<skill-name>/SKILL.md` with frontmatter:
   ```yaml
   ---
   name: skill-name
   description: One-line description
   license: MIT
   compatibility: opencode
   ---
   ```
2. Plugin config hook automatically copies it on install
3. Add tests if the skill has tool dependencies

### Adding a New Tool

1. Create class in `src/tools/<name>.ts`
2. Export factory function
3. Register in `plugin.ts` using `tool()` helper
4. Add type definitions to `src/types.ts`
5. Write unit tests

### Modifying Agents

Edit markdown files in `assets/agents/`:
- Update frontmatter for permissions/tools
- Modify system prompt for behavior changes

## Code Style

- No comments — use descriptive names
- Classes over helper functions
- Nullable (`string | null`) over optional (`string?`)
- Function declarations, not arrow functions
- Explicit types on all parameters and returns
- No `any` — use `unknown` with type guards

## Testing

```bash
bun test              # Run all tests
bun test --watch      # Watch mode
bun run check         # Type check
```

## Commit Convention

```
<type>(<scope>): <subject>

Types: feat, fix, docs, style, refactor, test, chore
```

Examples:
```
feat(execute): add stall detection with nudge-once pattern
fix(state): handle missing state file gracefully
docs(readme): update usage examples for new commands
```

## Release Process

1. Update `VERSION` in `plugin.ts`
2. Update `version` in `package.json`
3. Add entry to `CHANGELOG.md`
4. Run tests: `bun test && bun run check`
5. Commit and tag
6. Push to trigger release

## Questions?

Open an issue for bugs or feature requests.
