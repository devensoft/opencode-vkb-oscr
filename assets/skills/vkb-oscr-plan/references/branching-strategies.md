# Branching Strategies for OSCR

Detailed explanations of the four branching strategy options.

---

## Strategy A: Feature Branch + Phase Branches (Recommended)

### Overview
Create a base/feature branch from main, then create phase branches that merge back into the base branch. The base branch merges to main only after all phases complete.

### Workflow
```
main
  ↓ (create)
feature/my-change  ←────────────────────────┐
  ↓ (branch)                                │
phase/1-setup ──→ (work) ──→ (merge) ──────┤
  ↓ (branch after 1 merges)                 │
phase/2-core ────→ (work) ──→ (merge) ─────┤
  ↓ (branch after 2 merges)                 │
phase/3-tests ───→ (work) ──→ (merge) ─────┘
                                              ↓ (final merge)
main ←────────────────────────────────────────┘
```

### Pros
- Clean history within the feature
- Easy to review entire change as a whole
- Phases can build on previous phase changes
- Coordinator controls when phases integrate

### Cons
- Requires careful merge sequence
- More complex branch management

### Best For
- Multi-phase changes with dependencies
- Changes requiring coordinated review
- Complex refactors across multiple components

---

## Strategy B: Flat Phase Branches

### Overview
Each phase branches directly from main and merges back independently. No base branch.

### Workflow
```
main ←── phase/1-setup ───┐
main ←── phase/2-core ────┤
main ←── phase/3-tests ───┘
```

### Pros
- Simple and straightforward
- Phases are truly independent
- Easy to parallelize

### Cons
- Cannot build on previous phase work easily
- Risk of conflicts between parallel phases
- Harder to review as a cohesive change

### Best For
- Independent phases with no dependencies
- Changes that can be deployed separately
- Simple, isolated modifications

---

## Strategy C: Long-Running Feature Branch

### Overview
All work happens in a single branch. Phases are marked with tags or commit markers.

### Workflow
```
main
  ↓
feature/my-change (tag: phase-1-complete)
                (tag: phase-2-complete)
                (tag: phase-3-complete)
                  ↓
                 main
```

### Pros
- Simplest branch structure
- No merge complexity between phases
- Easy to see full change history

### Cons
- Harder to isolate phase work
- All-or-nothing approach
- Limited parallelization

### Best For
- Small changes with few phases
- Single developer workflows
- Changes that must be atomic

---

## Strategy D: Custom

Use when none of the above fit. Common custom approaches:

### Staging Branch Pattern
```
main → staging → feature/my-change → phase/* branches
```

### Environment Branches
```
main → dev-branch → phase/* → qa-branch → main
```

### Feature Flag Pattern
All changes go to main behind feature flags:
```
main ← phase/1 (flagged)
main ← phase/2 (flagged)
main ← phase/3 (flagged)
# Enable flag when all phases complete
```

---

## Decision Guide

| Scenario | Recommended Strategy |
|----------|---------------------|
| Phases depend on each other | A |
| Phases are independent | B |
| Single developer, simple change | C |
| Complex enterprise workflow | D (custom) |
| Need to deploy phases separately | B |
| Want atomic deployment | A or C |
