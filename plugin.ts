import type { Plugin } from "@opencode-ai/plugin";
import { cp } from "node:fs/promises";
import { join } from "node:path";

const VERSION = "0.1.0";
const MARKER_FILE = ".opencode/vkb-oscr-installed";

const copyDir = async (src: string, dest: string): Promise<void> => {
  // cp with recursive:true will create destination directories automatically
  await cp(src, dest, { recursive: true, force: true });
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
        // Version differs - fall through to reinstall
      } catch {
        // Marker doesn't exist - install fresh
      }

      const skillsDir = `${config.projectRoot}/.opencode/skills`;
      const commandsDir = `${config.projectRoot}/.opencode/commands`;

      const skills = [
        "vkb-oscr-plan",
        "vkb-oscr-coordinate",
        "vkb-oscr-finalize"
      ];

      const pluginDir = import.meta.dir;

      for (const skill of skills) {
        const src = join(pluginDir, "assets", "skills", skill);
        const dest = join(skillsDir, skill);
        await copyDir(src, dest);
      }

      await copyDir(join(pluginDir, "assets", "commands"), commandsDir);

      await Bun.write(markerPath, VERSION);
    }
  }
};
