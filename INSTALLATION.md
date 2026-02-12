# Installation

Install the opencode-vkb-oscr plugin to enable OpenSpec Change Request workflow with Vibe KanBan integration.

## Prerequisites

Before installation, ensure you have:

- **OpenCode CLI** installed and configured
- **Bun** runtime (v1.0.0 or later)
- **Git** repository with push access
- **Vibe KanBan** configured with repositories
- **OpenSpec** project structure at `openspec/changes/`

Verify prerequisites:
```bash
opencode --version    # Should show OpenCode version
bun --version         # Should show Bun version
git --version         # Should show Git version
```

## Installation Methods

### Method 1: Plugin Installation (Recommended)

Add plugin to your project's `.opencode/opencode.json`:

```json
{
  "plugins": [
    "@opencode-ai/opencode-architect",
    "opencode-vkb-oscr"
  ]
}
```

Then install via OpenCode:

```bash
cd /path/to/your/project
opencode install opencode-vkb-oscr
```

OpenCode will:
1. Download the plugin
2. Run the config hook
3. Install skills to `.opencode/skills/`
4. Install commands to `.opencode/commands/`
5. Create version marker

### Method 2: Manual CLI Installation

Clone or download the plugin manually:

```bash
# Clone repository
git clone <repository-url> /path/to/opecode-vkb-oscr
cd /path/to/opecode-vkb-oscr

# Install dependencies
bun install

# Link to your project
bun link
cd /path/to/your/project
bun link opencode-vkb-oscr
```

Then add to `.opencode/opencode.json` as in Method 1.

### Method 3: Bun Package Installation (If Published)

If the plugin is published to npm:

```bash
bun add opencode-vkb-oscr
```

Add to `.opencode/opencode.json`:
```json
{
  "plugins": [
    "@opencode-ai/opencode-architect",
    "opencode-vkb-oscr"
  ]
}
```

## MCP Server Setup

The VKB-OSCR workflow requires Vibe KanBan MCP server integration.

### Enable VKB MCP Server

In your MCP configuration file (typically `~/.config/openai/mcp.json`):

```json
{
  "mcpServers": {
    "vibe-kanban": {
      "command": "npx",
      "args": ["@vibe-kanban/mcp-server"],
      "env": {
        "VKB_API_URL": "https://your-vkb-instance.com",
        "VKB_API_KEY": "your-api-key"
      }
    }
  }
}
```

Replace:
- `VKB_API_URL` with your VKB instance URL
- `VKB_API_KEY` with your VKB API key

### Verify MCP Connection

After configuration, verify MCP server is available:

```bash
opencode mcp list
```

You should see `vibe-kanban` in the list.

## Verification

After installation, verify everything is working:

### 1. Check Plugin Status

```bash
opencode plugin list
```

You should see `opencode-vkb-oscr` in the active plugins.

### 2. Verify Skills Installed

```bash
ls .opencode/skills/
```

You should see:
- `vkb-oscr-plan/`
- `vkb-oscr-coordinate/`
- `vkb-oscr-finalize/`

### 3. Verify Commands Installed

```bash
ls .opencode/commands/
```

You should see:
- `vkb-oscr.md`

### 4. Test Skill Loading

```bash
skill list
```

All three VKB-OSCR skills should appear in the list.

### 5. Test MCP Connection

```bash
opencode mcp test vibe-kanban
```

Should return success message with server information.

## Troubleshooting

### Plugin Not Listed

**Problem:** Plugin doesn't appear in `opencode plugin list`

**Solutions:**
1. Check `.opencode/opencode.json` spelling
2. Ensure plugin is installed in `node_modules` or linked
3. Restart OpenCode CLI
4. Check for conflicting plugins

### Skills Not Installed

**Problem:** Skills directory doesn't contain VKB-OSCR skills

**Solutions:**
1. Run `opencode install opencode-vkb-oscr` again
2. Check permissions on `.opencode/skills/` directory
3. Delete version marker `.opencode/vkb-oscr-installed` and retry
4. Check plugin logs for errors

### MCP Server Not Connected

**Problem:** VKB MCP server not available

**Solutions:**
1. Verify MCP configuration file path
2. Check VKB_API_URL and VKB_API_KEY values
3. Test VKB API connectivity manually
4. Restart OpenCode CLI after configuration
5. Check firewall/proxy settings

### Version Marker Issues

**Problem:** Plugin re-installs every run

**Solutions:**
1. Delete `.opencode/vkb-oscr-installed` file
2. Check write permissions on `.opencode/` directory
3. Verify VERSION constant in plugin.ts matches package.json

### Type Errors

**Problem:** TypeScript errors during development

**Solutions:**
1. Run `bun install` to ensure dependencies
2. Check TypeScript version in `package.json`
3. Run `bun run check` to see specific errors
4. Ensure `@opencode-ai/plugin` is installed

## Uninstallation

To remove the plugin:

```bash
# Uninstall via OpenCode
opencode uninstall opencode-vkb-oscr

# Remove from .opencode/opencode.json
# Edit and remove "opencode-vkb-oscr" from plugins array

# Remove installed skills
rm -rf .opencode/skills/vkb-oscr-plan
rm -rf .opencode/skills/vkb-oscr-coordinate
rm -rf .opencode/skills/vkb-oscr-finalize

# Remove commands
rm -rf .opencode/commands/vkb-oscr.md

# Remove version marker
rm -f .opencode/vkb-oscr-installed
```

## Next Steps

After successful installation:

1. Read [README.md](README.md) for usage examples
2. Review [AGENTS.md](AGENTS.md) for development guidelines
3. Check [CONTRIBUTING.md](CONTRIBUTING.md) for making changes

For help, report issues or check documentation at:
- https://github.com/anomalyco/opencode-vkb-oscr/issues
