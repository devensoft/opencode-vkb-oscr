---
description: Show current OSCR orchestration status
agent: vibe-orchestrator
subtask: true
---

Load state with oscr_load and display a status summary.

Show:
- Current phase
- Total cards and their statuses
- Any escalated or stuck cards
- Time elapsed since run started
- Last checkpoint time

If no state found, report "No active OSCR run."
