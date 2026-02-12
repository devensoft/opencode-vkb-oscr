# Archive Process

## Overview

Archiving moves a completed OSCR from the active changes directory to a timestamped archive location. This preserves the complete change history while keeping the active workspace clean.

## Archive Location

Archived changes are stored at:

```
openspec/changes/archive/YYYY-MM-DD-<change-name>/
```

The timestamp uses the archive date, not the creation date.

## What Gets Archived

The entire change directory is moved, including:

- `request.md` - Original change request
- `plan.md` - Implementation plan
- `specs/` - All delta specifications
  - `ADDED/` - New specifications
  - `MODIFIED/` - Modified specifications
  - `REMOVED/` - Removed specifications
  - `RENAMED/` - Renamed specifications
- Phase subdirectories (if any)
- Any other files in the change directory

## Archive Process Steps

1. **Validate Change Status**
   - Verify all phases are complete
   - Confirm sync has been performed
   - Check no uncommitted changes

2. **Create Archive Directory**
   - Generate timestamp: `YYYY-MM-DD`
   - Create path: `openspec/changes/archive/YYYY-MM-DD-<change-name>/`

3. **Move Change Contents**
   - Copy all files from `openspec/changes/<change-name>/`
   - Preserve directory structure
   - Verify copy integrity

4. **Remove Original**
   - Delete `openspec/changes/<change-name>/`
   - Confirm removal

5. **Update Registry** (if applicable)
   - Mark change as archived
   - Record archive location

## Why Archive?

**Organization**: Keeps active changes directory clean and focused on in-progress work

**History**: Preserves complete record of all changes for audit and reference

**Recovery**: Archived changes can be referenced or restored if needed

**Performance**: Smaller active changes directory improves tooling performance

## Accessing Archived Changes

To review an archived change:

```bash
# List archives
ls -la openspec/changes/archive/

# View specific archive
cat openspec/changes/archive/YYYY-MM-DD-<change-name>/request.md

# Compare with current specs
diff openspec/changes/archive/YYYY-MM-DD-<change-name>/specs/MODIFIED/ openspec/specs/
```

## Archive Retention

Archived changes are typically kept indefinitely as they represent the complete history of system evolution. Consider:

- Backing up archive directory periodically
- Documenting significant changes in project wiki
- Referencing archives for regression analysis
