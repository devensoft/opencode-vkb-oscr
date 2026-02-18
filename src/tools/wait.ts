import type { VkbTaskResponse, WaitResult } from "../types";

export class TaskWaiter {
  private readonly taskId: string;
  private readonly vkbBaseUrl: string;
  private readonly pollIntervalMs: number;
  private readonly timeoutMs: number;

  constructor(
    taskId: string,
    vkbBaseUrl: string,
    pollIntervalMs: number,
    timeoutMs: number
  ) {
    this.taskId = taskId;
    this.vkbBaseUrl = vkbBaseUrl;
    this.pollIntervalMs = pollIntervalMs;
    this.timeoutMs = timeoutMs;
  }

  async execute(): Promise<string> {
    const startTime = Date.now();
    let lastTask: VkbTaskResponse | null = null;

    while (!this.hasTimedOut(startTime)) {
      await Bun.sleep(this.pollIntervalMs);
      lastTask = await this.fetchTask();
      if (this.isCompleted(lastTask)) {
        return this.buildResultJson(lastTask, startTime, false);
      }
    }

    return this.buildTimeoutResultJson(lastTask, startTime);
  }

  private hasTimedOut(startTime: number): boolean {
    return Date.now() - startTime >= this.timeoutMs;
  }

  private async fetchTask(): Promise<VkbTaskResponse> {
    const url = `${this.vkbBaseUrl}/api/tasks/${this.taskId}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`VKB API returned ${response.status} for task ${this.taskId}`);
    }
    return (await response.json()) as VkbTaskResponse;
  }

  private isCompleted(task: VkbTaskResponse): boolean {
    return task.has_in_progress_attempt === false;
  }

  private buildResultJson(
    task: VkbTaskResponse,
    startTime: number,
    timedOut: boolean
  ): string {
    const result: WaitResult = {
      taskId: this.taskId,
      completed: !task.has_in_progress_attempt,
      status: task.status,
      hasInProgressAttempt: task.has_in_progress_attempt,
      elapsedMs: Date.now() - startTime,
      timedOut: timedOut,
    };
    return JSON.stringify(result);
  }

  private buildTimeoutResultJson(
    task: VkbTaskResponse | null,
    startTime: number
  ): string {
    if (task === null) {
      const result: WaitResult = {
        taskId: this.taskId,
        completed: false,
        status: "unknown",
        hasInProgressAttempt: true,
        elapsedMs: Date.now() - startTime,
        timedOut: true,
      };
      return JSON.stringify(result);
    }
    return this.buildResultJson(task, startTime, true);
  }
}

export function createTaskWaiter(
  taskId: string,
  vkbBaseUrl: string,
  pollIntervalMs: number,
  timeoutMs: number
): TaskWaiter {
  return new TaskWaiter(taskId, vkbBaseUrl, pollIntervalMs, timeoutMs);
}
