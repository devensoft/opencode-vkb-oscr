---
description: Resume OSCR execution from saved state
agent: vibe-orchestrator
---

Resume OSCR execution from saved state.

Load state with oscr_load. If no state found, report error and stop.

If state phase is "plan", load the oscr-execute skill and begin execution.
If state phase is "execute", resume from where we left off (check card statuses).
If state phase is "finalize", load the oscr-finalize skill.
