# Contributing to opencode-vkb-oscr

Thank you for your interest in contributing to the VKB-OSCR workflow plugin!

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd opecode-vkb-oscr
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up development environment**
   ```bash
   bun run check    # Type check
   bun test         # Run tests
   ```

## Package Structure

```
opecode-vkb-oscr/
├── assets/                    # Plugin assets to install
│   ├── commands/              # Command files
│   │   └── vkb-oscr.md     # Main command documentation
│   └── skills/               # OpenCode skills
│       ├── vkb-oscr-plan/     # Planning skill
│       │   ├── SKILL.md
│       │   └── references/
│       ├── vkb-oscr-coordinate/ # Coordination skill
│       │   ├── SKILL.md
│       │   └── references/
│       └── vkb-oscr-finalize/ # Finalization skill
│           ├── SKILL.md
│           └── references/
├── tests/                    # Test files
│   ├── integration/          # Integration tests
│   └── unit/               # Unit tests
│       └── plugin.test.ts
├── plugin.ts                # Main plugin implementation
├── index.ts                 # Package entry point
├── package.json             # Package configuration
├── tsconfig.json           # TypeScript configuration
└── .opencode/            # OpenCode configuration
    └── opencode.json      # Plugin list
```

## Making Changes

### Adding a New Skill

1. Create skill directory in `assets/skills/<skill-name>/`
2. Create `SKILL.md` with YAML frontmatter:
   ```yaml
   ---
   name: skill-name
   description: One-line description
   license: MIT
   compatibility: opencode
   metadata:
     category: workflow
     workflow: vkb-oscr
   ---
   ```
3. Add reference documentation in `references/` subdirectory
4. Update plugin.ts to copy the new skill
5. Add tests for the skill installation

### Updating Plugin Logic

The main plugin logic is in `plugin.ts`:

- `VERSION`: Plugin version string
- `copyDir()`: Recursive directory copy function
- `plugin.hooks.config()`: Installation hook

When modifying:
- Update VERSION if changing behavior
- Ensure backward compatibility
- Add tests for new functionality
- Update documentation

### Modifying Skills

Skills are Markdown files in `assets/skills/`:

- Maintain YAML frontmatter format
- Keep progressive disclosure structure
- Cross-link to reference documents
- Update related command documentation

### Documentation Updates

- **README.md**: Overview and usage
- **AGENTS.md**: Guidelines for AI agents
- **CHANGELOG.md**: Version history
- Reference docs in skill directories

## Testing

### Running Tests

```bash
# Run all tests
bun test

# Run in watch mode
bun test --watch

# Run specific test file
bun test tests/unit/plugin.test.ts
```

### Writing Tests

Tests are in `tests/unit/`:

```typescript
import { describe, it, expect, beforeEach } from "bun:test";

describe("plugin config", () => {
  beforeEach(() => {
    // Setup
  });

  it("should install assets on first run", async () => {
    // Test implementation
    expect(result).toBeDefined();
  });
});
```

### Test Coverage

Ensure tests cover:
- Plugin installation (first run, reinstall, upgrade)
- Asset copying (skills, commands)
- Version marker handling
- Error scenarios (missing assets, permission errors)

## Submitting Changes

1. **Branch from main**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/your-change
   ```

2. **Make your changes**
   - Follow code style guidelines
   - Add tests for new functionality
   - Update documentation

3. **Run checks**
   ```bash
   bun run check  # Type check
   bun test         # All tests pass
   ```

4. **Commit with conventional messages**
   ```bash
   git add .
   git commit -m "feat(plan): add new branching strategy option"
   ```

5. **Push and create PR**
   ```bash
   git push -u origin feature/your-change
   gh pr create --title "feat: add new branching strategy option"
   ```

## Code Style

- TypeScript with strict mode enabled
- Conventional commits for messages
- Clear, self-documenting code
- No comments (let code speak)
- 100 characters max line length

### TypeScript Guidelines

```typescript
// ✅ Good
import type { Plugin } from "@opencode-ai/plugin";

const VERSION = "0.1.0";

export const plugin: Plugin = {
  name: "vkb-oscr",
  version: VERSION,
  hooks: { /* ... */ }
};

// ❌ Bad
const v = "0.1.0";
const plugin = { name: "vkb-oscr", v: v };
```

## Release Process

1. Update `VERSION` in `plugin.ts`
2. Update `version` in `package.json`
3. Add entry to `CHANGELOG.md`
4. Run full test suite
5. Commit and tag
6. Push tag to trigger release

## Questions?

- Open an issue for bugs or feature requests
- Check existing issues before creating new ones
- Use discussions for questions or proposals
