import type { Plugin } from "@opencode-ai/plugin";

const VERSION = "0.1.0";
const MARKER_FILE = ".opencode/vkb-oscr-installed";

const copyDir = async (src: string, dest: string): Promise<void> => {
  const srcPath = import.meta.resolveSync(src.replace(/^\//, "")) ?? src;
  const srcDir = Bun.file(srcPath.slice(7));

  for await (const entry of new Deno.Dir(src.slice(7))) {
    const from = `${src}/${entry.name}`;
    const to = `${dest}/${entry.name}`;

    if (entry.isDirectory) {
      await Deno.mkdir(to, { recursive: true });
      await copyDir(from, to);
    } else {
      await Deno.copyFile(from.slice(7), to.slice(7));
    }
  }
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

        await Deno.mkdir(skillsDir, { recursive: true });
        await Deno.mkdir(commandsDir, { recursive: true });

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
