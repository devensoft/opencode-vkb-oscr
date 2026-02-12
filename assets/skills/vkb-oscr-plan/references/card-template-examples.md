# Card Template Examples

Example card descriptions for different types of phases.

---

## Example 1: Setup/Configuration Phase

```markdown
## Phase 1: Project Setup and Dependencies

### Implementation Tasks
- [ ] Install required npm packages (zod, vitest)
- [ ] Create directory structure: src/validators/, tests/validators/
- [ ] Set up validation configuration file
- [ ] Add validation types and interfaces

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
- `npm run test` - All existing tests pass
- `npm run build` - No build errors
- `npm run lint` - No linting errors
- Verify new directories exist and are in .gitignore if needed

### Non-Blocking Issues
If non-blocking issues are found:
- Create follow-up card in TODO status
- Include issue description and file reference
- Continue with current phase completion

### Merge-Back Instructions
This phase branch should be merged to base after completion.
VKB will NOT auto-merge - coordinator must manually merge.
```

---

## Example 2: Core Implementation Phase

```markdown
## Phase 2: Core Validation Logic

### Implementation Tasks
- [ ] Implement base Validator class
- [ ] Add string validation methods
- [ ] Add number validation methods
- [ ] Add custom rule support
- [ ] Write unit tests for all validators

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
- `npm run test` - All validator tests pass (aim for >90% coverage)
- `npm run test:watch` - Verify tests run in watch mode
- `npm run build` - TypeScript compiles without errors
- Manual test: Create a sample validation in test file

### Non-Blocking Issues
If non-blocking issues are found:
- Create follow-up card in TODO status
- Include issue description and file reference
- Continue with current phase completion

### Merge-Back Instructions
This phase branch should be merged to base after completion.
VKB will NOT auto-merge - coordinator must manually merge.
```

---

## Example 3: Integration Phase

```markdown
## Phase 3: Integration and API

### Implementation Tasks
- [ ] Integrate validators with existing form components
- [ ] Add validation hooks to form submission
- [ ] Update error messaging system
- [ ] Add validation state to form context
- [ ] Test integration with existing forms

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
- `npm run test` - All tests pass
- `npm run test:e2e` - E2E tests pass if they touch forms
- `npm run build` - Build succeeds
- `npm run lint` - No lint errors
- Manual verification: Test 2-3 existing forms

### Non-Blocking Issues
If non-blocking issues are found:
- Create follow-up card in TODO status
- Include issue description and file reference
- Continue with current phase completion

### Merge-Back Instructions
This phase branch should be merged to base after completion.
VKB will NOT auto-merge - coordinator must manually merge.
```

---

## Example 4: Documentation Phase

```markdown
## Phase 4: Documentation and Examples

### Implementation Tasks
- [ ] Write README.md for validation system
- [ ] Create usage examples
- [ ] Document all public APIs with JSDoc
- [ ] Add validation cookbook with common patterns
- [ ] Update CHANGELOG.md

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
- `npm run test` - Ensure docs examples work
- `npm run build` - Verify build includes docs
- `npm run lint:md` - If available, lint markdown
- Review: Check all links in documentation

### Non-Blocking Issues
If non-blocking issues are found:
- Create follow-up card in TODO status
- Include issue description and file reference
- Continue with current phase completion

### Merge-Back Instructions
This phase branch should be merged to base after completion.
VKB will NOT auto-merge - coordinator must manually merge.
```

---

## Example 5: Bug Fix Phase

```markdown
## Phase 2: Fix Authentication Bypass

### Implementation Tasks
- [ ] Identify root cause of bypass vulnerability
- [ ] Implement fix in auth middleware
- [ ] Add regression tests
- [ ] Update security documentation
- [ ] Verify fix doesn't break existing flows

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
- `npm run test` - All tests pass, especially new regression tests
- `npm run test:security` - Run security-focused tests
- `npm run test:e2e` - E2E auth flows pass
- `npm run build` - Build succeeds
- Manual: Test auth bypass scenario is fixed

### Security Notes
This is a security fix. Additional considerations:
- Do not mention vulnerability details in commit messages
- Keep branch names generic (avoid "security-fix" in name)
- Coordinate with security team before merge

### Non-Blocking Issues
If non-blocking issues are found:
- Create follow-up card in TODO status
- Include issue description and file reference
- Continue with current phase completion

### Merge-Back Instructions
This phase branch should be merged to base after completion.
VKB will NOT auto-merge - coordinator must manually merge.
```

---

## Template Variables

When generating cards, replace these variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `{{PHASE_NUMBER}}` | Phase sequence number | 1, 2, 3 |
| `{{PHASE_NAME}}` | Phase title from tasks.md | "Core Implementation" |
| `{{TASKS}}` | Task list from tasks.md | "- [ ] Task 1\n- [ ] Task 2" |
| `{{TEST_COMMAND}}` | Project test command | `npm test` |
| `{{BUILD_COMMAND}}` | Project build command | `npm run build` |
