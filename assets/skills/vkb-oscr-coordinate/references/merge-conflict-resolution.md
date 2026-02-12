# Merge Conflict Resolution

Guide for resolving common merge conflicts during VKB-OpenSpec phase merges.

## Common Conflict Scenarios

### tasks.md Conflicts

Most common conflict type. Occurs when:
- VKB updates tasks.md
- Coordinator manually updates tasks.md
- Both make changes to same sections

**Example conflict:**
```markdown
<<<<<<< HEAD (base branch)
## Phase 1: Foundation
- [x] Create OpenSpec schema files
- [x] Implement validation logic
- [ ] Add error handling
=======
## Phase 1: Foundation
- [x] Create OpenSpec schema files
- [x] Implement validation logic  
- [x] Add error handling
- [x] Write tests for validation
>>>>>>> phase-1-foundation
```

**Resolution:**
```markdown
## Phase 1: Foundation
- [x] Create OpenSpec schema files
- [x] Implement validation logic  
- [x] Add error handling
- [x] Write tests for validation
```

**Principle:** Keep the more complete version. Phase branch usually has the latest state.

### Configuration File Conflicts

Occurs in files like:
- `package.json`
- `pyproject.toml`
- `Cargo.toml`
- `opencode.json`

**Example conflict (package.json):**
```json
<<<<<<< HEAD
  "scripts": {
    "test": "jest",
    "build": "tsc"
  }
=======
  "scripts": {
    "test": "jest",
    "build": "tsc",
    "test:e2e": "playwright test"
  }
>>>>>>> phase-1-foundation
```

**Resolution:**
```json
  "scripts": {
    "test": "jest",
    "build": "tsc",
    "test:e2e": "playwright test"
  }
```

**Principle:** Keep additions from phase branch. Don't remove base branch entries.

### Source Code Conflicts

Occurs when:
- Both branches modify same file
- VKB refactors code coordinator touched
- Parallel development on same component

**Example conflict:**
```typescript
<<<<<<< HEAD
export function validateSpec(data: unknown): ValidationResult {
  const validator = createValidator();
  return validator.validate(data);
}
=======
export function validateSpec(data: unknown): ValidationResult {
  const validator = createValidator({ strict: true });
  const result = validator.validate(data);
  
  if (!result.valid) {
    logValidationErrors(result.errors);
  }
  
  return result;
}
>>>>>>> phase-1-foundation
```

**Resolution:**
```typescript
export function validateSpec(data: unknown): ValidationResult {
  const validator = createValidator({ strict: true });
  const result = validator.validate(data);
  
  if (!result.valid) {
    logValidationErrors(result.errors);
  }
  
  return result;
}
```

**Principle:** Phase branch has the OpenSpec implementation. Use it unless:
- It breaks functionality
- It removes critical code
- It contradicts project patterns

## Resolution Workflow

### Step 1: Identify Conflicts

```bash
git status
# Shows conflicted files
```

### Step 2: Examine Each Conflict

```bash
git diff
# Shows conflict markers
```

### Step 3: Resolve Each File

For each conflicted file:

1. Open file in editor
2. Find conflict markers (<<<<<<<, =======, >>>>>>>)
3. Analyze both versions
4. Choose or combine appropriate content
5. Remove conflict markers
6. Save file

### Step 4: Mark Resolved

```bash
git add <resolved-file>
```

### Step 5: Complete Merge

```bash
git commit -m "Resolve conflicts after phase-N merge

Conflicts resolved:
- tasks.md: kept phase branch version (most complete)
- package.json: merged scripts section
- src/validator.ts: kept phase branch implementation"
```

## Conflict Prevention

### Before Phase Starts

1. Ensure base branch is up to date
2. Pull latest changes
3. Verify clean working directory

### During Phase

1. Minimize manual edits to files VKB will touch
2. If must edit, document for merge
3. Commit manual changes with clear messages

### At Phase End

1. Let VKB finish before manual edits
2. Wait for grace period
3. Check what VKB modified

## Special Cases

### Binary File Conflicts

VKB rarely creates binary conflicts, but if they occur:

```bash
# Choose phase branch version
git checkout --theirs <binary-file>
git add <binary-file>

# Or choose base branch version
git checkout --ours <binary-file>
git add <binary-file>
```

### Deleted File Conflicts

Occurs when one branch deletes a file the other modifies:

```bash
# Keep the file (phase branch modified it)
git add <file>

# Or delete it (base branch is correct)
git rm <file>
```

### Rename Conflicts

VKB may rename files during refactoring:

```bash
# Check if rename was intentional
git log --follow <new-file-name>

# If correct, accept rename
git add <new-file-name>
git rm <old-file-name>
```

## Tools for Resolution

### Command Line

```bash
# See conflict summary
git status

# See conflict details
git diff

# See specific file conflicts
git diff <file>

# Accept all from phase branch
git checkout --theirs .
git add .

# Accept all from base branch
git checkout --ours .
git add .
```

### Merge Tools

Configure merge tool for easier resolution:

```bash
git mergetool
# Opens configured tool (vscode, meld, etc.)
```

## Post-Resolution Verification

After resolving conflicts:

1. **Review the resolution**
   ```bash
   git diff HEAD~1
   ```

2. **Run tests**
   ```bash
   npm test
   ```

3. **Verify functionality**
   - Check modified files work correctly
   - Run affected components
   - Validate no logic lost

4. **Document unusual resolutions**
   - Explain why one version chosen over other
   - Note any manual combinations
   - Reference in commit message
