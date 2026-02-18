---
name: oscr-intake
description: Phase 0 intake workflow for OSCR. Confirms change names, VKB connection, push preferences, and model choices via interactive octto Q&A. Use when starting a new OSCR run to gather configuration before planning.
license: MIT
compatibility: opencode
---

# OSCR Intake (Phase 0)

Gather and validate all configuration needed before creating VKB cards.

## Step 1: Determine Change Names

The user provides change names in one of three forms:

- **Single name**: `"add-auth-module"` — use as-is
- **Comma-separated list**: `"add-auth, fix-routing"` — split and trim
- **Keyword "active" or "all"**: run `openspec status --json` and collect all change names where `status === "active"`

If the input is ambiguous, use octto `ask_text` to clarify:

```
Question: "Which OpenSpec changes should this run process?"
Placeholder: "e.g. my-change, or 'active' for all active changes"
```

## Step 2: Infer VKB Server URL

1. Read `opencode.json` from the project root
2. Look in `mcp` config for a server entry whose key contains `vibe-kanban` (case-insensitive)
3. Extract the URL from that entry's config (e.g. `url` or `command` args)
4. If not found, use octto `ask_text`:

```
Question: "What is the VKB server URL?"
Placeholder: "http://localhost:3000"
```

## Step 3: Confirm Push Preference

Use octto `confirm`:

```
Question: "Push branches to remote after merge?"
Default: No (stay local)
```

Record as `pushToRemote: boolean` in config.

## Step 4: Choose Executor Model

Use octto `pick_one`:

```
Question: "Which executor model should VKB use?"
Options:
  - OPENCODE (recommended)
  - CLAUDE
  - CODEX
  - CURSOR
  - GEMINI
  - COPILOT
Recommended: OPENCODE
```

Record as `executorId` in config.

## Step 5: Validate Changes

Run `openspec status --json` and confirm each listed change exists and is active.

- Filter out any change name not found or not active
- If all names are invalid, report error and stop
- If some are filtered, inform the user which were skipped and why

## Step 6: Resolve VKB Project Metadata

Fetch project metadata from VKB to populate config:

1. `GET {vkbBaseUrl}/api/remote/projects` — find the remote project, record `remoteProjectId`
2. `GET {vkbBaseUrl}/api/remote/project-statuses?project_id={remoteProjectId}` — record status IDs into `VkbStatusIds`
3. `GET {vkbBaseUrl}/api/repos` — record `repoId`
4. Use the hardcoded legacy project ID: `a049fb72-64c9-4ecb-bb69-e091ddcd8c3e`

## Step 7: Save Initial State

Build and save `OscrState` via `oscr_save`:

```json
{
  "runId": "<generate uuid>",
  "phase": "intake",
  "config": {
    "vkbBaseUrl": "<from step 2>",
    "legacyProjectId": "a049fb72-64c9-4ecb-bb69-e091ddcd8c3e",
    "remoteProjectId": "<from step 6>",
    "orgId": "<from VKB info>",
    "repoId": "<from step 6>",
    "executorId": "<from step 4>",
    "pollIntervalMs": 15000,
    "stallTimeoutMs": 600000,
    "maxFixCycles": 2,
    "pushToRemote": false,
    "baseBranch": "<current branch>"
  },
  "statusIds": { "todo": "...", "done": "...", "..." : "..." },
  "cards": [],
  "changeNames": ["<validated names>"],
  "startedAt": "<timestamp>",
  "lastCheckpoint": null
}
```

After saving, update phase to `"plan"` and proceed to `oscr-plan`.
