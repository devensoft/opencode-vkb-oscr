---
description: Finalize completed OSCR changes (sync, verify, archive)
agent: vibe-orchestrator
---

Run only the OSCR finalization phase.

Load state with oscr_load. If no state found, report error and stop.

Load the oscr-finalize skill and run finalization for all "done" cards.
