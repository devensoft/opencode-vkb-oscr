# OSCR Orchestration Workflow

```mermaid
flowchart TD
    subgraph Phase0["Phase 0: Intake (oscr-intake)"]
        I1[Load oscr-intake skill]
        I2[Determine change names<br/>single/list/active]
        I3[Infer VKB URL from<br/>opencode.json MCP config]
        I4[octto: Confirm push preference]
        I5[octto: Choose executor model]
        I6[Validate via openspec status]
        I7[Save initial OscrState]
        I1 --> I2 --> I3 --> I4 --> I5 --> I6 --> I7
    end

    subgraph Phase1["Phase 1: Plan (oscr-plan)"]
        P1[Load oscr-plan skill]
        P2[Load state via oscr_load]
        P3[For each change:<br/>openspec instructions --json]
        P4[Create kanban issue<br/>via MCP create_issue]
        P5[Build CardState entries]
        P6[Save state, transition<br/>to execute phase]
        P1 --> P2 --> P3 --> P4 --> P5 --> P6
    end

    subgraph Phase2["Phase 2: Execute (oscr-execute)"]
        direction TB
        E1["STEP 1: Create & Launch<br/>POST /api/tasks/create-and-start"]
        E2["Get session ID<br/>GET /api/sessions?workspace_id=..."]
        E3["oscr_follow_up:<br/>Send card template instructions"]
        E4["STEP 2: Wait<br/>oscr_wait (server-side poll)"]
        E5{has_in_progress_attempt<br/>=== false?}
        E6["Stall: Nudge once<br/>via oscr_follow_up"]
        E7["Escalate to human"]
        E8["STEP 3: Review<br/>@oscr-reviewer subagent"]
        E9{VERDICT?}
        E10["Fix via oscr_follow_up<br/>(max 2 cycles)"]
        E11["STEP 4: Merge<br/>git merge --no-ff"]
        E12["Explicitly update issue<br/>to Done status"]
        E13["STEP 5: Checkpoint<br/>Save state, continue"]

        E1 --> E2 --> E3 --> E4 --> E5
        E5 -->|Yes| E8
        E5 -->|No, timeout| E6
        E6 -->|Still stuck| E7
        E6 -->|Resumed| E4
        E8 --> E9
        E9 -->|Fail, cycles left| E10
        E10 --> E4
        E9 -->|Fail, no cycles| E7
        E9 -->|Pass| E11
        E11 --> E12 --> E13
        E13 -->|More cards| E1
    end

    subgraph Phase3["Phase 3: Finalize (oscr-finalize)"]
        F1[Load oscr-finalize skill]
        F2[For each done card:<br/>openspec sync]
        F3[openspec verify]
        F4[openspec archive]
        F5[Generate summary report]
        F6[Clean up state file]
        F1 --> F2 --> F3 --> F4 --> F5 --> F6
    end

    Phase0 --> Phase1 --> Phase2 --> Phase3

    subgraph Legend["Components"]
        L1["@vibe-orchestrator<br/>Primary agent"]
        L2["Skills<br/>oscr-intake/plan/execute/finalize"]
        L3["Tools<br/>oscr_save/load/wait/follow_up"]
        L4["@oscr-reviewer<br/>Hidden subagent"]
        L5["VKB Executor<br/>OPENCODE/CLAUDE/etc."]
        L1 --> L2
        L2 --> L3
        L1 -.->|Task tool| L4
        L1 -.->|HTTP API| L5
    end
```

# Card State Machine

```mermaid
stateDiagram-v2
    [*] --> pending: CardState created
    pending --> launched: create-and-start + follow-up
    launched --> executing: oscr_wait polling
    executing --> reviewing: has_in_progress_attempt=false
    reviewing --> fixing: VERDICT=fail, cycles left
    fixing --> executing: follow-up sent
    reviewing --> merging: VERDICT=pass
    merging --> done: git merge + update_issue
    executing --> escalated: timeout + nudge failed
    reviewing --> escalated: max fix cycles exceeded
    
    note right of pending: Awaiting launch
    note right of launched: VKB executor starting
    note right of executing: Executor working
    note right of reviewing: @oscr-reviewer analyzing
    note right of done: Merged to base branch
    note right of escalated: Human intervention needed
```

# Agent Interaction Sequence

```mermaid
sequenceDiagram
    participant User
    participant VO as @vibe-orchestrator
    participant Skill as Skills (intake/plan/execute/finalize)
    participant Tool as Tools (save/load/wait/follow_up)
    participant VKB as VKB HTTP API
    participant Reviewer as @oscr-reviewer
    participant Octto as octto (Q&A)

    User->>VO: /oscr user-auth-v2
    
    Note over VO: Phase 0: Intake
    VO->>Skill: load oscr-intake
    Skill->>Octto: confirm push preference
    Octto-->>Skill: No (stay local)
    Skill->>Tool: oscr_save(initial state)
    
    Note over VO: Phase 1: Plan
    VO->>Skill: load oscr-plan
    Skill->>Tool: oscr_load
    Skill->>VKB: MCP create_issue
    VKB-->>Skill: issue_id
    Skill->>Tool: oscr_save(cards pending)
    
    Note over VO: Phase 2: Execute
    VO->>Skill: load oscr-execute
    
    loop For each card
        Skill->>VKB: POST /api/tasks/create-and-start
        VKB-->>Skill: task_id, workspace_id
        Skill->>VKB: GET /api/sessions?workspace_id=...
        VKB-->>Skill: session_id
        Skill->>Tool: oscr_follow_up(card template)
        
        Skill->>Tool: oscr_wait(task_id, timeout)
        Tool-->>Skill: {completed: true/false}
        
        alt Completed
            Skill->>Reviewer: Task tool (review prompt)
            Reviewer-->>Skill: {VERDICT: pass/fail}
            
            alt Fail, cycles left
                Skill->>Tool: oscr_follow_up(fix instructions)
                Note over Skill: Back to wait
            else Pass
                Skill->>Skill: git merge --no-ff
                Skill->>VKB: MCP update_issue (Done)
            end
        else Timeout
            Skill->>Tool: oscr_follow_up(nudge)
            Note over Skill: Wait half-timeout
            alt Still stuck
                Note over Skill: Escalate to human
            end
        end
        
        Skill->>Tool: oscr_save(checkpoint)
    end
    
    Note over VO: Phase 3: Finalize
    VO->>Skill: load oscr-finalize
    Skill->>Skill: openspec sync/verify/archive
    Skill->>User: Summary report
```

# Tool Data Flow

```mermaid
flowchart LR
    subgraph State["State Management"]
        S1[oscr_save]
        S2[oscr_load]
        SF[(".opencode/.oscr-state.json")]
    end
    
    subgraph VKB["VKB Integration"]
        W1[oscr_wait]
        W2[oscr_follow_up]
        API[("VKB HTTP API<br/>/api/tasks<br/>/api/sessions")]
    end
    
    subgraph OscrState["OscrState"]
        ST1[runId, phase]
        ST2[config]
        ST3[cards: CardState[]]
    end
    
    S1 --> SF
    SF --> S2
    S2 --> ST1
    S2 --> ST2
    S2 --> ST3
    
    W1 --> API
    W2 --> API
    
    API -->|task status| W1
    API -->|session follow-up| W2
```
