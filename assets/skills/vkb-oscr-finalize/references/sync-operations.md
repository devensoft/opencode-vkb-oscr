# Sync Operations

## Overview

Syncing merges delta specifications from an OSCR into the canonical specs directory (`openspec/specs/`). This operation applies all changes defined in the change's `specs/` directory.

## Operation Types

Delta specs are organized into four operation categories:

### ADDED

**Purpose**: Introduce new specifications that didn't exist before

**Location**: `openspec/changes/<change>/specs/ADDED/`

**Behavior**:
- Copies new spec files to `openspec/specs/`
- Maintains directory structure
- Fails if target already exists (prevents overwrites)

**Example**:
```
specs/ADDED/api/new-endpoint.spec.md
→ specs/api/new-endpoint.spec.md
```

### MODIFIED

**Purpose**: Update existing specifications with changes

**Location**: `openspec/changes/<change>/specs/MODIFIED/`

**Behavior**:
- Replaces existing spec files in `openspec/specs/`
- Preserves file path relative to specs directory
- Fails if target doesn't exist (prevents creating orphans)

**Example**:
```
specs/MODIFIED/api/existing-endpoint.spec.md
→ specs/api/existing-endpoint.spec.md (overwrites)
```

### REMOVED

**Purpose**: Delete specifications that are no longer needed

**Location**: `openspec/changes/<change>/specs/REMOVED/`

**Behavior**:
- Contains markers or full files indicating removal
- Deletes corresponding files from `openspec/specs/`
- Fails if target doesn't exist

**Example**:
```
specs/REMOVED/api/deprecated-endpoint.spec.md
→ removes specs/api/deprecated-endpoint.spec.md
```

### RENAMED

**Purpose**: Move or rename specifications while preserving history

**Location**: `openspec/changes/<change>/specs/RENAMED/`

**Behavior**:
- Contains mapping of old path to new path
- Moves file from old location to new location
- Preserves file content
- Fails if source doesn't exist or target already exists

**Example**:
```
specs/RENAMED/api/old-name.spec.md → models/new-name.spec.md
→ moves specs/api/old-name.spec.md to specs/models/new-name.spec.md
```

## Operation Order

Sync applies operations in this specific sequence:

1. **RENAMED** - Move files first to free up paths
2. **REMOVED** - Delete obsolete files
3. **MODIFIED** - Update existing files
4. **ADDED** - Create new files last

This order prevents conflicts and ensures clean application.

## Atomic Operation

Sync is **atomic**—all operations succeed or none do:

- If any operation fails, all changes are rolled back
- Prevents partial/inconsistent spec states
- Validation runs before any changes are applied

## Validation

Before applying changes, sync validates:

- All ADDED targets don't already exist
- All MODIFIED targets exist
- All REMOVED targets exist
- All RENAMED sources exist and targets don't exist
- No path conflicts between operations
- Spec syntax is valid

## Post-Sync Verification

After syncing, verify:

```bash
# Check git status for expected changes
git status openspec/specs/

# Review the diff
git diff openspec/specs/

# Validate specs are syntactically correct
openspec validate

# Run tests to ensure specs work correctly
npm test
```

## Conflict Resolution

If sync fails due to conflicts:

1. **Read error message** - Identifies which operation failed
2. **Check spec state** - Verify canonical specs are in expected state
3. **Resolve conflict**:
   - If target exists for ADDED: May need to use MODIFIED instead
   - If target missing for MODIFIED: May need to use ADDED instead
   - If already synced: Change may already be applied
4. **Re-run sync** after resolving
