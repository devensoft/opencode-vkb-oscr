# Installation

Install the opencode-vkb-oscr plugin to enable OpenSpec Change Request orchestration through Vibe-Kanban.

## Prerequisites

Before installation, ensure you have:

- **OpenCode CLI** installed and configured
- **Bun** runtime (v1.0.0 or later)
- **Git** repository with push access
- **Vibe KanBan** configured with repositories
- **OpenSpec** project structure at `openspec/changes/`
- **octto** plugin (for Phase 0 interactive Q&A)

Verify prerequisites:
```bash
opencode --version    # OpenCode version
bun --version         # Bun version
git --version         # Git version
```

## Installation Methods

### Method 1: Plugin Installation (Recommended)

Add plugin to your project's `.opencode/opencode.json`:

```json
{
  "plugins": [
    "opencode-vkb-oscr"
  ]
}
```

OpenCode will automatically:
1. Download and install the plugin
2. Run the config hook
3. Install agents to `.opencode/agents/`
4. Install skills to `.opencode/skills/`
5. Install commands to `.opencode/commands/`
6. Install templates to `.opencode/templates/`
7. Create version marker `.opencode/.oscr-installed`

### Method 2: Local Development

Clone and link for development:

```bash
git clone <repository-url> /path/to/opencode-vkb-oscr
cd /path/to/opencode-vkb-oscr
bun install
bun link

cd /path/to/your/project
bun link opencode-vkb-oscr
```

Add to `.opencode/opencode.json` as in Method 1.

## MCP Server Setup

The plugin integrates with Vibe KanBan via MCP.

### Configure VKB MCP Server

In your opencode.json or MCP configuration:

```json
{
  "mcpServers": {
    "vibe-kanban": {
      "command": "npx",
      "args": ["-y", "vibe-kanban", "--mcp"],
      "env": {}
    }
  }
}
```

The VKB server URL is inferred from this configuration during Phase 0 intake.

## Verification

### 1. Check Installed Components

```bash
# Agents
ls .opencode/agents/
# Should show: vibe-orchestrator.md, oscr-reviewer.md, oscr-verifier.md

# Skills
ls .opencode/skills/
# Should show: oscr-intake/, oscr-plan/, oscr-execute/, oscr-finalize/, oscr-vkb-quirks/

# Commands
ls .opencode/commands/
# Should show: oscr.md, oscr-plan.md, oscr-exec.md, oscr-fin.md, oscr-status.md

# Templates
ls .opencode/templates/
# Should show: card-template.md
```

### 2. Test Agent Availability

In OpenCode:
```
@vibe-orchestrator hello
```

Should respond with the orchestrator agent.

### 3. Test Commands

```
/oscr-status
```

Should report "No active OSCR run" if no state exists.

## Troubleshooting

### Plugin Not Loading

1. Check `.opencode/opencode.json` for correct plugin name
2. Ensure plugin is installed in `node_modules` or linked
3. Restart OpenCode
4. Check for version marker file `.opencode/.oscr-installed`

### Skills Not Installed

1. Delete `.opencode/.oscr-installed` marker file
2. Restart OpenCode to re-trigger config hook
3. Check permissions on `.opencode/` directory

### MCP Server Not Connected

1. Verify MCP configuration in opencode.json
2. Test VKB server manually: `curl http://localhost:49861/api/health`
3. Check VKB server logs for errors

### Version Mismatch

If plugin re-installs every run:
1. Check VERSION in plugin.ts matches package.json version
2. Delete `.opencode/.oscr-installed` and retry

## Uninstallation

```bash
# Remove from .opencode/opencode.json
# Delete "opencode-vkb-oscr" from plugins array

# Remove installed assets
rm -rf .opencode/agents/vibe-orchestrator.md
rm -rf .opencode/agents/oscr-reviewer.md
rm -rf .opencode/agents/oscr-verifier.md
rm -rf .opencode/skills/oscr-*
rm -rf .opencode/commands/oscr*.md
rm -rf .opencode/templates/card-template.md
rm -f .opencode/.oscr-installed
```

## Next Steps

1. Read [README.md](README.md) for usage examples
2. Review [AGENTS.md](AGENTS.md) for development guidelines
3. Check [CONTRIBUTING.md](CONTRIBUTING.md) for making changes
