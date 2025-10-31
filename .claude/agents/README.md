# Claude Code Agents Collection

A curated collection of specialized Claude Code agents for enhanced development workflows.

## Available Agents

### 📝 Documentation & Maintenance
- **docs-sync-maintainer** - Keeps documentation in sync with code changes
- **theme-consistency-validator** - Validates design token usage and theme consistency

### ⚡ Performance & Optimization
- **performance-optimizer** - Analyzes and optimizes React application performance
- **monorepo-optimizer** - Optimizes monorepo structure and build processes

### 🚀 Development Experience
- **dx-orchestrator** - Sets up and automates developer tooling and workflows
- **rapid-prototyping** - Scaffolds UI components and enables rapid iteration

### 🔮 Advanced Coordination
- **neural-mesh-orchestrator** - Coordinates multiple AI agents for complex tasks

## Quick Start

### Install Agents in a New Project

```bash
# Clone this repo into your project's .claude directory
mkdir -p .claude
cd .claude
git clone https://github.com/YOUR_USERNAME/claude-agents.git agents
```

### Or use the initialization script

```bash
# Download and run the init script
curl -fsSL https://raw.githubusercontent.com/YOUR_USERNAME/claude-agents/main/init-agents.sh | bash
```

## Manual Installation

1. Create the agents directory:
   ```bash
   mkdir -p .claude/agents
   cd .claude/agents
   ```

2. Clone this repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/claude-agents.git .
   ```

3. The agents will be automatically available in Claude Code!

## Usage

Once installed, these agents will be available in your Claude Code environment. They can be invoked:
- Automatically based on their trigger conditions
- Through the Task tool when appropriate
- Via agent-specific commands

## Agent Descriptions

### docs-sync-maintainer
Automatically maintains documentation sync when:
- Pull requests modify component files
- TypeScript types or JSDoc comments change
- New components are added
- Breaking changes are introduced

### theme-consistency-validator
Validates theme consistency when:
- Component files are created or modified
- Tailwind config is updated
- Design token files change
- Before merging UI-related PRs

### performance-optimizer
Optimizes performance by analyzing:
- Bundle sizes and code splitting
- React rendering efficiency
- Runtime performance bottlenecks
- CSS-in-JS impact

### dx-orchestrator
Automates developer experience through:
- Scaffolding components and boilerplate
- Setting up development tools
- Creating IDE snippets
- Configuring ESLint/Prettier

### rapid-prototyping
Enables rapid UI development with:
- Component variant generation
- Prop combination testing
- Interactive playgrounds
- Hot-reload workflows

### monorepo-optimizer
Optimizes monorepo workflows via:
- Dependency graph analysis
- Incremental build optimization
- Package structure improvements
- Build caching strategies

### neural-mesh-orchestrator
Provides architectural guidance for:
- Multi-agent coordination patterns
- Distributed reasoning systems
- Knowledge sharing between agents
- LLM orchestration strategies

## Contributing

Feel free to add your own agents or improve existing ones! Each agent should:
- Have a clear, specific purpose
- Include comprehensive documentation
- Follow the Claude Code agent patterns
- Be well-tested in real-world scenarios

## License

MIT License - Feel free to use and modify as needed.

## Updating

To get the latest agent updates:

```bash
cd .claude/agents
git pull origin main
```

Or re-run the initialization script to get a fresh copy.
