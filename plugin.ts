import type { Plugin } from "@opencode-ai/plugin";
import { tool } from "@opencode-ai/plugin";
import { cp, readdir } from "node:fs/promises";
import { join } from "node:path";
import { createStateSaver, createStateLoader } from "./src/tools/state";
import { createTaskWaiter } from "./src/tools/wait";
import { createFollowUpSender } from "./src/tools/vkb";

const VERSION = "0.2.0";
const MARKER_FILE = ".opencode/.oscr-installed";

const ASSET_DIRECTORIES: ReadonlyArray<AssetMapping> = [
  { source: "skills", destination: "skills" },
  { source: "commands", destination: "commands" },
  { source: "agents", destination: "agents" },
  { source: "templates", destination: "templates" },
];

interface AssetMapping {
  source: string;
  destination: string;
}

export const plugin: Plugin = async function oscrPlugin(input) {
  const projectRoot = input.directory;
  const pluginDir = import.meta.dir;

  return {
    tool: {
      oscr_save: tool({
        description:
          "Save OSCR orchestration state to disk. Persists the full OscrState as JSON so it survives session restarts.",
        args: {
          state: tool.schema
            .string()
            .describe("JSON-stringified OscrState object to persist"),
        },
        async execute(args, context) {
          const saver = createStateSaver(context);
          return saver.execute(args.state);
        },
      }),

      oscr_load: tool({
        description:
          "Load OSCR orchestration state from disk. Returns the persisted OscrState JSON, or an error if no state exists.",
        args: {
          runId: tool.schema
            .string()
            .nullable()
            .describe(
              "Specific runId to load, or null to load the latest state"
            ),
        },
        async execute(args, context) {
          const loader = createStateLoader(context);
          return loader.execute(args.runId);
        },
      }),

      oscr_wait: tool({
        description:
          "Poll a VKB task until completion or timeout. Blocks server-side to prevent context explosion from repeated LLM polling loops. Returns a minimal WaitResult with completion status and elapsed time.",
        args: {
          taskId: tool.schema.string().describe("VKB task ID to monitor"),
          vkbBaseUrl: tool.schema
            .string()
            .describe("Base URL of the VKB server (e.g. http://localhost:3001)"),
          pollIntervalMs: tool.schema
            .number()
            .default(60000)
            .describe("Milliseconds between poll attempts (default: 60000)"),
          timeoutMs: tool.schema
            .number()
            .default(600000)
            .describe(
              "Maximum milliseconds to wait before returning a timeout (default: 600000)"
            ),
        },
        async execute(args) {
          const waiter = createTaskWaiter(
            args.taskId,
            args.vkbBaseUrl,
            args.pollIntervalMs,
            args.timeoutMs
          );
          return waiter.execute();
        },
      }),

      oscr_follow_up: tool({
        description:
          "Send a follow-up instruction to a VKB session. Used to nudge or redirect an executing agent with new guidance.",
        args: {
          sessionId: tool.schema
            .string()
            .describe("VKB session ID to send the follow-up to"),
          vkbBaseUrl: tool.schema
            .string()
            .describe("Base URL of the VKB server (e.g. http://localhost:3001)"),
          prompt: tool.schema
            .string()
            .describe("Instruction text to send to the VKB agent"),
          executorId: tool.schema
            .string()
            .default("OPENCODE")
            .describe(
              'Executor profile ID for the follow-up (default: "OPENCODE")'
            ),
        },
        async execute(args) {
          const sender = createFollowUpSender(
            args.sessionId,
            args.vkbBaseUrl,
            args.prompt,
            args.executorId
          );
          return sender.execute();
        },
      }),
    },

    async config(_config) {
      const markerPath = `${projectRoot}/${MARKER_FILE}`;

      if (await isAlreadyInstalled(markerPath)) {
        return;
      }

      await installAssets(pluginDir, projectRoot);
      await Bun.write(markerPath, VERSION);
    },

    event: async ({ event }) => {
      if (event.type === "session.deleted") {
        await handleSessionDeleted(projectRoot);
      }
    },
  };
};

async function isAlreadyInstalled(markerPath: string): Promise<boolean> {
  try {
    const existing = await Bun.file(markerPath).text();
    return existing === VERSION;
  } catch {
    return false;
  }
}

async function installAssets(
  pluginDir: string,
  projectRoot: string
): Promise<void> {
  for (const mapping of ASSET_DIRECTORIES) {
    const sourcePath = join(pluginDir, "assets", mapping.source);
    const destinationPath = join(projectRoot, ".opencode", mapping.destination);
    await copyDirectoryIfExists(sourcePath, destinationPath);
  }
}

async function copyDirectoryIfExists(
  source: string,
  destination: string
): Promise<void> {
  try {
    await readdir(source);
    await cp(source, destination, { recursive: true, force: true });
  } catch {
    // source directory does not exist, skip
  }
}

async function handleSessionDeleted(projectRoot: string): Promise<void> {
  const statePath = `${projectRoot}/.opencode/.oscr-state.json`;
  try {
    await Bun.file(statePath).text();
  } catch {
    // no state file to clean up
  }
}
