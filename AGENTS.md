# Project Guidelines for AI Agents

## Branch Naming

All feature branches should follow the pattern:
```
feature/<change-name>
oscr/<change-name>
change/<change-name>
```

Avoid using:
- `ai-*` pattern (reserved for internal AI workflows)
- Generic names like `feature-branch`
- Names that don't describe the change

## Commit Message Format

Follow conventional commits:
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:** feat, fix, docs, style, refactor, test, chore

**Examples:**
```
feat(auth): add JWT token validation

Implement JWT validation for authentication tokens with
HS256 algorithm support.

Closes #123
```

```
fix(coordinator): resolve tasks.md merge conflict

When merging phase branch to base, keep the most complete
version of tasks.md from phase branch.

Resolves #456
```

```
docs(vkb-oscr): update sync operation documentation

Added detailed examples for RENAMED operation behavior.
```

## TypeScript Style

- Use explicit types for all function parameters and return values
- Prefer interfaces over type aliases for object shapes
- Use `const` by default, `let` only when reassignment needed
- Follow function ordering: imports → types → constants → functions → exports
- Use meaningful variable names (avoid abbreviations)

**Example:**
```typescript
import type { Plugin } from "@opencode-ai/plugin";

interface SyncOperation {
  type: "ADDED" | "MODIFIED" | "REMOVED" | "RENAMED";
  source?: string;
  target: string;
}

const VERSION = "0.1.0";

export async function syncSpecs(
  changeName: string
): Promise<SyncOperation[]> {
  const operations = await parseChangeSpecs(changeName);
  return operations.filter(isValidOperation);
}

export { VERSION };
```

## Testing Protocol

### Unit Tests

Write unit tests for all public functions:
```typescript
import { describe, it, expect } from "bun:test";

describe("syncSpecs", () => {
  it("should parse valid change specs", async () => {
    const result = await syncSpecs("test-change");
    expect(result).toHaveLength(3);
  });
});
```

### Integration Tests

Test plugin integration:
```typescript
describe("plugin config hook", () => {
  it("should install skills on first run", async () => {
    const config = { projectRoot: "/tmp/test" };
    await plugin.hooks.config!(config);
    // Verify skills installed
  });
});
```

### Running Tests

```bash
bun test              # Run all tests
bun test --watch     # Watch mode
npm test              # If npm script configured
```

## Code Review Checklist

Before submitting changes:
- [ ] TypeScript compiles without errors (`npm run check`)
- [ ] All tests pass (`npm test`)
- [ ] Code follows TypeScript style guidelines
- [ ] Commit messages follow conventional commit format
- [ ] Documentation updated if needed
- [ ] No console.log statements left in code
- [ ] Error handling is appropriate

## File Organization

- Place TypeScript files in root or `tests/` directory
- Skills go in `assets/skills/<skill-name>/SKILL.md`
- Reference docs go in `assets/skills/<skill-name>/references/`
- Commands go in `assets/commands/`
- Keep plugin.ts minimal (config hook only)
- index.ts should only re-export from plugin.ts

## Documentation

- SKILL.md files must have YAML frontmatter with name, description, license, compatibility
- Reference files should use clear section headers
- Include examples in code blocks with proper syntax highlighting
- Cross-link between skills using relative paths to references

## Error Handling

- Always handle Promise rejections with try/catch
- Provide meaningful error messages
- Log errors appropriately for debugging
- Consider graceful degradation where possible

**Example:**
```typescript
try {
  const skills = await loadSkills();
  return skills;
} catch (error) {
  console.error("Failed to load skills:", error);
  return []; // Graceful fallback
}
```

## Plugin Development

- Plugin must export a `plugin` object matching Plugin type
- Implement `config` hook to install assets on first run
- Use version marker file to detect re-installation
- Support upgrading when version marker differs
- Use Bun.file and Bun.write APIs for file operations

**Config Hook Pattern:**
```typescript
hooks: {
  async config(config) {
    const markerPath = `${config.projectRoot}/.marker-file`;

    try {
      const existing = await Bun.file(markerPath).text();
      if (existing === VERSION) return; // Already installed
    } catch {
      // Install assets
      await copyAssets(config.projectRoot);
      await Bun.write(markerPath, VERSION);
    }
  }
}
```

## Testing Guidelines

- Unit tests for pure functions
- Integration tests for plugin hooks
- Test both success and error paths
- Use meaningful test descriptions
- Keep tests fast (avoid unnecessary I/O in unit tests)

## Code Quality

- Enable strict TypeScript in tsconfig.json
- No `any` types (use `unknown` with type guards)
- Prefer explicit returns over implicit
- Use early returns to reduce nesting
- Extract complex logic into named functions

## Performance

- Minimize file I/O operations
- Cache results where appropriate
- Use async/await properly
- Avoid blocking operations

## Security

- Never log sensitive information
- Validate all file paths before operations
- Handle path traversal vulnerabilities
- Use safe file operations with proper error handling
