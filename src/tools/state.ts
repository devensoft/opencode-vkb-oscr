import type { ToolContext } from "@opencode-ai/plugin";
import type { OscrState } from "../types";

const STATE_FILE_NAME = ".opencode/.oscr-state.json";

export class StateSaver {
  private readonly directory: string;

  constructor(directory: string) {
    this.directory = directory;
  }

  async execute(stateJson: string): Promise<string> {
    const parsed = this.parseState(stateJson);
    const filePath = this.resolveStatePath();
    await Bun.write(filePath, stateJson);
    return `State saved for runId=${parsed.runId} phase=${parsed.phase}`;
  }

  private parseState(stateJson: string): OscrState {
    return JSON.parse(stateJson) as OscrState;
  }

  private resolveStatePath(): string {
    return `${this.directory}/${STATE_FILE_NAME}`;
  }
}

export class StateLoader {
  private readonly directory: string;

  constructor(directory: string) {
    this.directory = directory;
  }

  async execute(runId: string | null): Promise<string> {
    const filePath = this.resolveStatePath();
    const content = await this.readStateFile(filePath);
    if (content === null) {
      return JSON.stringify({ error: "No state file found" });
    }
    return this.filterByRunId(content, runId);
  }

  private resolveStatePath(): string {
    return `${this.directory}/${STATE_FILE_NAME}`;
  }

  private async readStateFile(filePath: string): Promise<string | null> {
    try {
      return await Bun.file(filePath).text();
    } catch {
      return null;
    }
  }

  private filterByRunId(content: string, runId: string | null): string {
    if (runId === null) {
      return content;
    }
    const parsed = JSON.parse(content) as OscrState;
    if (parsed.runId !== runId) {
      return JSON.stringify({ error: `State runId=${parsed.runId} does not match requested runId=${runId}` });
    }
    return content;
  }
}

export function createStateSaver(context: ToolContext): StateSaver {
  return new StateSaver(context.directory);
}

export function createStateLoader(context: ToolContext): StateLoader {
  return new StateLoader(context.directory);
}
