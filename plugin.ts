import type { Plugin } from "@opencode-ai/plugin";
import { mkdir, cp } from "node:fs/promises";

const VERSION = "0.1.0";
const MARKER_FILE = ".opencode/vkb-oscr-installed";

const copyDir = async (src: string, dest: string): Promise<void> => {
  const srcPath = import.meta.resolveSync(src.replace(/^\//, "")) ?? src;
  await mkdir(dest, { recursive: true });
  await cp(srcPath, dest, { recursive: true });
};

export const plugin: Plugin = {
  name: "vkb-oscr",
  version: VERSION,
  hooks: {
    async config(config) {
      const markerPath = `${config.projectRoot}/${MARKER_FILE}`;

      try {
        const existing = await Bun.file(markerPath).text();
        if (existing === VERSION) {
          return;
        }
      } catch {
        const skillsDir = `${config.projectRoot}/.opencode/skills`;
        const commandsDir = `${config.projectRoot}/.opencode/commands`;

        await mkdir(skillsDir, { recursive: true });
        await mkdir(commandsDir, { recursive: true });

        const skills = [
          "vkb-oscr-plan",
          "vkb-oscr-coordinate",
          "vkb-oscr-finalize"
        ];

        for (const skill of skills) {
          const src = `./assets/skills/${skill}`;
          const dest = `${skillsDir}/${skill}`;
          await copyDir(src, dest);
        }

        await copyDir("./assets/commands", commandsDir);

        await Bun.write(markerPath, VERSION);
      }
    }
  }
};
