export interface OscrConfig {
  vkbBaseUrl: string | null;
  legacyProjectId: string;
  remoteProjectId: string;
  orgId: string;
  repoId: string;
  executorId: string;
  pollIntervalMs: number;
  stallTimeoutMs: number;
  maxFixCycles: number;
  pushToRemote: boolean;
  baseBranch: string;
}

export interface VkbStatusIds {
  todo: string;
  inProgress: string;
  inReview: string;
  done: string;
  cancelled: string;
  backlog: string;
}

export interface CardState {
  changeName: string;
  cardTitle: string;
  issueId: string | null;
  taskId: string | null;
  workspaceId: string | null;
  sessionId: string | null;
  startTime: number | null;
  status:
    | "pending"
    | "launched"
    | "executing"
    | "reviewing"
    | "fixing"
    | "merging"
    | "done"
    | "escalated";
  fixCycleCount: number;
  nudgeSent: boolean;
  worktreeBranch: string | null;
  reviewNotes: string | null;
}

export interface OscrState {
  runId: string;
  phase: "intake" | "plan" | "execute" | "finalize";
  config: OscrConfig;
  statusIds: VkbStatusIds;
  cards: CardState[];
  changeNames: string[];
  startedAt: number;
  lastCheckpoint: number | null;
}

export interface VkbTaskResponse {
  id: string;
  title: string;
  status: string;
  has_in_progress_attempt: boolean;
  workspace_id: string | null;
}

export interface VkbSessionInfo {
  id: string;
  workspace_id: string;
}

export interface WaitResult {
  taskId: string;
  completed: boolean;
  status: string;
  hasInProgressAttempt: boolean;
  elapsedMs: number;
  timedOut: boolean;
}
