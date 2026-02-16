import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { mkdir, rm, stat } from "node:fs/promises";

import { plugin } from "../../plugin.ts";

describe("plugin", () => {
  const mockConfig = {
    projectRoot: "/tmp/test-project"
  };

  beforeEach(async () => {
    await mkdir("/tmp/test-project/.opencode", { recursive: true });
  });

  afterEach(async () => {
    await rm("/tmp/test-project", { recursive: true });
  });

  describe("config hook", () => {
    it("should install assets on first run", async () => {
      const markerPath = `${mockConfig.projectRoot}/.opencode/vkb-oscr-installed`;

      await plugin.hooks.config!(mockConfig);

      const markerExists = await stat(markerPath).then(() => true, () => false);
      expect(markerExists).toBe(true);

      const skillsDir = `${mockConfig.projectRoot}/.opencode/skills`;
      const planSkillExists = await stat(`${skillsDir}/vkb-oscr-plan`).then(() => true, () => false);
      const coordinateSkillExists = await stat(`${skillsDir}/vkb-oscr-coordinate`).then(() => true, () => false);
      const finalizeSkillExists = await stat(`${skillsDir}/vkb-oscr-finalize`).then(() => true, () => false);

      expect(planSkillExists).toBe(true);
      expect(coordinateSkillExists).toBe(true);
      expect(finalizeSkillExists).toBe(true);

      const commandsDir = `${mockConfig.projectRoot}/.opencode/commands`;
      const commandExists = await stat(`${commandsDir}/vkb-oscr.md`).then(() => true, () => false);
      expect(commandExists).toBe(true);
    });

    it("should skip installation if version marker matches", async () => {
      const markerPath = `${mockConfig.projectRoot}/.opencode/vkb-oscr-installed`;
      await Bun.write(markerPath, "0.1.0");

      await plugin.hooks.config!(mockConfig);

      const markerContent = await Bun.file(markerPath).text();
      expect(markerContent).toBe("0.1.0");
    });

    it("should re-install if version marker differs", async () => {
      const markerPath = `${mockConfig.projectRoot}/.opencode/vkb-oscr-installed`;
      await Bun.write(markerPath, "0.0.1");

      await plugin.hooks.config!(mockConfig);

      const markerContent = await Bun.file(markerPath).text();
      expect(markerContent).toBe("0.1.0");
    });

    it("should handle missing assets gracefully", async () => {
      const faultyConfig = {
        projectRoot: "/tmp/nonexistent-project"
      };

      const result = await plugin.hooks.config!(faultyConfig).catch(e => e);

      expect(result).toBeDefined();
    });
  });

  describe("plugin metadata", () => {
    it("should have correct name", () => {
      expect(plugin.name).toBe("vkb-oscr");
    });

    it("should have version constant", () => {
      expect(plugin.version).toBeDefined();
      expect(typeof plugin.version).toBe("string");
    });

    it("should have config hook", () => {
      expect(plugin.hooks).toBeDefined();
      expect(plugin.hooks.config).toBeDefined();
    });
  });
});
