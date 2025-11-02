# Context Management - SaaSaaS Project

This directory contains comprehensive context snapshots for the SaaSaaS project, enabling seamless session restoration and knowledge transfer.

## 📁 Files

### `session-2025-10-31.json`
**Machine-readable context snapshot** in structured JSON format.

- **Format**: JSON Schema validated
- **Use Case**: Programmatic context retrieval, vector database ingestion, automated analysis
- **Contains**: Full project state, task metadata, architectural decisions, dependencies, knowledge graph
- **Size**: ~15KB (comprehensive mode)

### `SESSION-CONTEXT.md`
**Human-readable context summary** in Markdown format.

- **Format**: GitHub-flavored Markdown
- **Use Case**: Quick reference, session resumption, onboarding
- **Contains**: Same information as JSON but formatted for readability
- **Sections**:
  - Project status and progress (20% complete, 6/30 tasks)
  - Architecture overview (tech stack, repository structure)
  - Key architectural decisions (10 critical choices)
  - Implementation phases (4 phases, weekly breakdown)
  - Critical principles (AI = build-time only, one thing perfect)
  - Current challenges and next actions
  - Success metrics (MVP criteria)
  - Dependencies and knowledge graph

## 🎯 Purpose

### Session Restoration
When resuming work after a break:
1. Read `SESSION-CONTEXT.md` for quick orientation
2. Check current task status (TASK-007 in progress)
3. Review next actions (complete base service template)
4. Understand blocking relationships (23 tasks depend on TASK-007)

### Knowledge Transfer
For new team members or AI agents:
1. Load `session-2025-10-31.json` for complete project state
2. Review architectural decisions and their rationale
3. Understand implementation phases and progress
4. Identify critical files and dependencies

### Context Compression
The context snapshots use semantic compression:
- **Minimal Mode**: Key facts only (~5KB)
- **Standard Mode**: Full state (~10KB)
- **Comprehensive Mode**: Includes knowledge graph (~15KB) ← Current

## 🔄 Update Frequency

Context snapshots should be updated:
- ✅ After completing major tasks (e.g., TASK-007)
- ✅ Before switching context or taking breaks
- ✅ After architectural decisions
- ✅ Weekly milestone completion
- ✅ Before/after each phase

## 🧠 Knowledge Graph

The context includes a knowledge graph showing relationships:

```
CLI Tool → Config Schema (validates)
       → Project Generator (orchestrates)
         → Template Engine (uses)
           → Fastify Service (generates)
```

This enables:
- Dependency analysis
- Impact assessment
- Intelligent context retrieval
- Cross-cutting concern identification

## 📊 Context Fingerprint

Each snapshot has a unique fingerprint:
- **Current**: `saasquatch-20251031-phase1-week1`
- **Format**: `{project}-{date}-{phase}-{week}`
- **Purpose**: Version control, drift detection, semantic diffing

## 🔍 Vector Database Ready

The JSON context is structured for vector database ingestion:
- Semantic embeddings can be generated from text fields
- Knowledge graph enables similarity search
- Architectural decisions tagged for retrieval
- Dependencies mapped for context expansion

## 📈 Context Evolution

Track context changes over time:
- **v1.0.0** (2025-10-31): Phase 1, Week 1, 20% complete, TASK-007 in progress
- **v1.1.0** (future): Phase 1 complete, ready for Phase 2
- **v2.0.0** (future): Phase 2 complete, auth service perfect
- **v3.0.0** (future): Phase 3 complete, infrastructure integrated
- **v4.0.0** (future): MVP complete, ready for npm publish

## 🚀 Quick Start

### For Humans
```bash
# Quick orientation
cat SESSION-CONTEXT.md | head -100

# Full context
open SESSION-CONTEXT.md

# Check current task
grep "Current Task" SESSION-CONTEXT.md
```

### For AI Agents
```python
import json

# Load structured context
with open('session-2025-10-31.json') as f:
    context = json.load(f)

# Access specific information
current_task = context['progress']['currentTask']
next_actions = context['nextActions']
arch_decisions = context['architecturalDecisions']
```

## 📝 Context Schema

The JSON follows this schema:
- `project`: Name, version, phase, description
- `progress`: Task completion, current status
- `architecturalDecisions`: Key choices with rationale
- `techStack`: CLI tool + generated services
- `repositoryStructure`: Directory layout
- `implementationPhases`: 4-week roadmap
- `criticalPrinciples`: Project philosophy
- `keyFiles`: Important files to know
- `configurationSchema`: Zod schema structure
- `recentCommits`: Git history
- `currentChallenges`: Blockers and issues
- `nextActions`: Prioritized action items
- `dependencies`: NPM packages
- `knowledgeGraph`: Component relationships
- `semanticTags`: Searchable keywords

## 🔐 Security Note

Context snapshots may contain sensitive information:
- ❌ Do NOT commit API keys or secrets
- ❌ Do NOT include production credentials
- ✅ DO include architectural patterns
- ✅ DO include dependency versions
- ✅ DO include task metadata

The `.gitignore` should include:
```
.context/*.json
.context/SESSION-CONTEXT.md
```

But keep `README.md` committed for documentation.

---

*Last Updated: 2025-10-31 23:50 UTC*
*Context Version: 1.0.0*
