import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { mkdir, rm, stat } from "node:fs/promises";

import { plugin } from "../../plugin";

describe("plugin", () => {
  const mockProjectRoot = "/tmp/test-project";

  beforeEach(async () => {
    await mkdir("/tmp/test-project/.opencode", { recursive: true });
  });

  afterEach(async () => {
    await rm("/tmp/test-project", { recursive: true });
  });

  describe("config hook", () => {
    it("should install assets on first run", async () => {
      const markerPath = `${mockProjectRoot}/.opencode/vkb-oscr-installed`;

      const hooks = await plugin({
        client: {} as never,
        project: {} as never,
        directory: mockProjectRoot,
        worktree: mockProjectRoot,
        serverUrl: new URL("http://localhost"),
        $: {} as never
      });

      await hooks.config!({} as never);

      const markerExists = await stat(markerPath).then(() => true, () => false);
      expect(markerExists).toBe(true);

      const skillsDir = `${mockProjectRoot}/.opencode/skills`;
      const planSkillExists = await stat(`${skillsDir}/vkb-oscr-plan`).then(() => true, () => false);
      const coordinateSkillExists = await stat(`${skillsDir}/vkb-oscr-coordinate`).then(() => true, () => false);
      const finalizeSkillExists = await stat(`${skillsDir}/vkb-oscr-finalize`).then(() => true, () => false);

      expect(planSkillExists).toBe(true);
      expect(coordinateSkillExists).toBe(true);
      expect(finalizeSkillExists).toBe(true);

      const commandsDir = `${mockProjectRoot}/.opencode/commands`;
      const commandExists = await stat(`${commandsDir}/vkb-oscr.md`).then(() => true, () => false);
      expect(commandExists).toBe(true);
    });

    it("should skip installation if version marker matches", async () => {
      const markerPath = `${mockProjectRoot}/.opencode/vkb-oscr-installed`;
      await Bun.write(markerPath, "0.1.0");

      const hooks = await plugin({
        client: {} as never,
        project: {} as never,
        directory: mockProjectRoot,
        worktree: mockProjectRoot,
        serverUrl: new URL("http://localhost"),
        $: {} as never
      });

      await hooks.config!({} as never);

      const markerContent = await Bun.file(markerPath).text();
      expect(markerContent).toBe("0.1.0");
    });

    it("should re-install if version marker differs", async () => {
      const markerPath = `${mockProjectRoot}/.opencode/vkb-oscr-installed`;
      await Bun.write(markerPath, "0.0.1");

      const hooks = await plugin({
        client: {} as never,
        project: {} as never,
        directory: mockProjectRoot,
        worktree: mockProjectRoot,
        serverUrl: new URL("http://localhost"),
        $: {} as never
      });

      await hooks.config!({} as never);

      const markerContent = await Bun.file(markerPath).text();
      expect(markerContent).toBe("0.1.0");
    });

    it("should handle missing assets gracefully", async () => {
      const faultyProjectRoot = "/tmp/nonexistent-project";

      const hooks = await plugin({
        client: {} as never,
        project: {} as never,
        directory: faultyProjectRoot,
        worktree: faultyProjectRoot,
        serverUrl: new URL("http://localhost"),
        $: {} as never
      });

      const result = await hooks.config!({} as never).catch((e: Error) => e);

      expect(result).toBeDefined();
    });
  });

  describe("plugin function", () => {
    it("should return hooks when called with valid input", async () => {
      const hooks = await plugin({
        client: {} as never,
        project: {} as never,
        directory: mockProjectRoot,
        worktree: mockProjectRoot,
        serverUrl: new URL("http://localhost"),
        $: {} as never
      });

      expect(hooks).toBeDefined();
      expect(hooks.config).toBeDefined();
    });
  });
});
