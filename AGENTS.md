# Project Guidelines for AI Agents

## Branch Naming

Feature branches should follow:
```
feature/<change-name>
oscr/<change-name>
change/<change-name>
```

Avoid:
- `ai-*` pattern (reserved)
- Generic names like `feature-branch`

## Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:** feat, fix, docs, style, refactor, test, chore

## TypeScript Style

- Explicit types for all parameters and returns
- Interfaces over type aliases for object shapes
- `const` by default, `let` only when reassignment needed
- Function ordering: imports → types → constants → functions → exports
- No comments — use descriptive names
- Classes over helper functions
- Nullable (`string | null`) over optional (`string?`)
- Function declarations, not arrow functions
- No `any` — use `unknown` with type guards

**Example:**
```typescript
import type { Plugin } from "@opencode-ai/plugin";

interface CardState {
  changeName: string;
  taskId: string | null;
  status: "pending" | "launched" | "done";
}

const VERSION = "0.2.0";

function createCardState(changeName: string): CardState {
  return {
    changeName,
    taskId: null,
    status: "pending"
  };
}

export { CardState, VERSION, createCardState };
```

## Testing

```bash
bun test              # Run all tests
bun test --watch      # Watch mode
bun run check         # Type check
```

Write unit tests for all public functions and tools.

## File Organization

- `src/types.ts` — All interfaces and types
- `src/tools/` — Custom tool implementations
- `assets/agents/` — Agent markdown files
- `assets/skills/` — Skill SKILL.md files
- `assets/commands/` — Slash command markdown files
- `assets/templates/` — User-modifiable templates
- `tests/unit/` — Unit tests

## Plugin Structure

The plugin exports three hooks:

```typescript
export const plugin: Plugin = async (input) => {
  return {
    tool: {
      // Custom tools registered here
    },
    async config(_config) {
      // Asset installation on first run
    },
    event: async ({ event }) => {
      // Lifecycle event handling
    },
  };
};
```

## Code Quality

- Strict TypeScript enabled
- No console.log in production code
- Early returns to reduce nesting
- Extract complex logic into named methods
- Handle all Promise rejections

## Security

- Never log sensitive information
- Validate file paths before operations
- Handle path traversal vulnerabilities
