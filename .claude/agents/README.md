# Claude Code Agents Collection

A curated collection of **5 high-quality, specialized agents** for comprehensive development workflows. This collection has been optimized to eliminate redundancy while maintaining full functionality through strategic consolidation.

## 🎯 Final Agent Lineup (5 Agents)

### 1. **component-generator** 🎨
**Comprehensive React component lifecycle management**

All-in-one agent handling:
- ✅ Component generation (rapid + standard modes)
- ✅ Code review (quality, performance, accessibility)
- ✅ Architecture validation (pattern enforcement)
- ✅ Theme consistency (design token compliance)
- ✅ Test coverage (unit, integration, accessibility)

**Replaces:** component-architecture-enforcer, react-component-reviewer, theme-consistency-validator, test-coverage-guardian

**Use when:**
- Creating new components
- Reviewing existing components
- Validating architectural patterns
- Checking design token usage
- Ensuring test coverage

**Example:**
```
user: "Create a Button with variants" → Generates complete component suite
user: "Review this Modal for accessibility" → Comprehensive review
user: "Does Card follow our design system?" → Theme validation
```

---

### 2. **rapid-prototyping** 📦
**Component scaffolding, documentation, and showcases**

Specialized in:
- Interactive component playgrounds
- Storybook stories generation
- Framework-specific examples (Next.js, Remix, Vite)
- Component galleries and showcases
- Design token-based variant generation
- Performance benchmarks and metrics

**Use when:**
- Need quick component scaffolding
- Building interactive documentation
- Creating component showcases
- Generating framework examples
- Setting up Storybook stories

---

### 3. **monorepo-optimizer** ⚡
**Monorepo build + React performance optimization**

Comprehensive optimization for:
- **Build Performance:** pnpm workspaces, Turborepo, incremental builds, caching
- **Dependency Management:** Affected packages, circular deps, workspace filters
- **React Performance:** Bundle analysis, rendering optimization, code-splitting
- **Performance Budgets:** Bundle size tracking, metrics monitoring

**Replaces:** performance-optimizer (merged in)

**Use when:**
- Optimizing monorepo build times
- Analyzing affected packages
- Reducing bundle sizes
- Fixing React rendering issues
- Implementing code-splitting
- Setting performance budgets

**Example:**
```
user: "Speed up monorepo builds" → Build optimization
user: "Why is the bundle so large?" → Bundle analysis
user: "Dashboard renders slowly" → React performance review
```

---

### 4. **dx-orchestrator** 🛠️
**Developer experience automation**

Automates:
- Code scaffolding (Plop.js templates)
- IDE configuration (VS Code, JetBrains)
- Workspace scripts (pnpm commands)
- ESLint/Prettier setup
- Environment setup automation
- Onboarding documentation

**Use when:**
- Setting up new projects
- Creating code generators
- Configuring IDE tooling
- Automating repetitive tasks
- Onboarding new developers

---

### 5. **agent-orchestrator** 🎭
**Complex task coordination & multi-agent architecture**

Capabilities:
- Complex task decomposition into parallel workstreams
- Cognitive diversity application (convergent, divergent, lateral, systems, critical, abstract)
- Anticipatory development (predicts future needs)
- Multi-agent architecture consulting

**Use when:**
- Complex multi-step tasks
- Need multiple perspectives
- Architectural decisions
- Large-scale refactoring
- System design problems

**Example:**
```
user: "Refactor auth to support OAuth" → Orchestrates parallel workstreams
user: "I set up the API service" → Anticipates next needs proactively
```

---

## 📊 Consolidation Summary

**Before:** 15+ agents with significant overlap
**After:** 5 focused, comprehensive agents
**Reduction:** ~67% fewer agents, 100% functionality retained

### Consolidation Mapping

| **Merged Into** | **Absorbed Agents** |
|---|---|
| component-generator | component-architecture-enforcer, react-component-reviewer, theme-consistency-validator, test-coverage-guardian |
| monorepo-optimizer | performance-optimizer |
| *Removed* | omniscient-context-agent, reality-check-reviewer, nx-monorepo-architect, sparc-developer, mcp-server-builder |

**Removed agents** were either:
- Not applicable to current project (nx-monorepo-architect, mcp-server-builder)
- Overly complex methodology (sparc-developer)
- Niche use case (reality-check-reviewer)
- Overlapping with orchestrator (omniscient-context-agent)

---

## 🚀 Quick Start

### Agent Selection Guide

**Need to work with UI components?**
→ `component-generator` (creation, review, validation, testing)
→ `rapid-prototyping` (docs, playgrounds, showcases)

**Performance issues?**
→ `monorepo-optimizer` (builds, bundles, rendering)

**Setting up tooling?**
→ `dx-orchestrator` (automation, IDE, scaffolding)

**Complex architectural tasks?**
→ `agent-orchestrator` (coordination, planning, anticipation)

---

## 📖 Detailed Agent Capabilities

### component-generator

**Generation Mode:**
```typescript
// Generates:
components/Button/
  ├── Button.tsx          // CVA variants, TypeScript, forwardRef
  ├── Button.stories.tsx  // Comprehensive Storybook stories
  ├── Button.test.tsx     // Jest + RTL tests (90%+ coverage)
  └── index.ts            // Barrel export
```

**Review Mode:**
- ⚠️ Critical Issues (bugs, accessibility failures)
- 🚀 Performance Concerns (memo, callbacks, re-renders)
- 🏗️ Architecture Violations (pattern deviations)
- 🎨 Theme Consistency (hardcoded values → design tokens)
- 🧪 Test Coverage Gaps (missing test scenarios)

**Architecture Validation:**
- Container/Presenter separation
- Compound component patterns
- Proper TypeScript usage
- File structure compliance

**Theme Validation:**
- Detects hardcoded colors (`#3B82F6` → `blue-500`)
- Validates spacing scale (`16px` → `p-4`)
- Checks dark mode variants
- Ensures WCAG AA contrast

**Test Coverage:**
- Unit tests (logic, rendering)
- Integration tests (component interactions)
- Accessibility tests (jest-axe, ARIA)
- User event tests (click, keyboard, forms)

---

### rapid-prototyping

**Generates:**
- Complete Storybook story suites
- Interactive playgrounds with prop controls
- Framework examples (Next.js, Remix, Vite)
- Accessibility documentation (WCAG compliance)
- Performance benchmarks (bundle size, render metrics)
- Component galleries and showcases

**Design Token Integration:**
- Parses tokens to generate variants
- Creates size variants from spacing scale
- Generates color variants from palette
- Implements state variants (hover, active, disabled)

---

### monorepo-optimizer

**Build Optimization:**
```bash
# Analyze affected packages
pnpm --filter=...{origin/main} build

# Parallel execution
turbo build --parallel

# Remote caching
turbo build --cache-dir=.turbo-cache
```

**Bundle Analysis:**
```markdown
📦 Total: 450kb → Recommend: 280kb
Top Dependencies:
  1. moment (72kb) → date-fns (-50kb)
  2. lodash (48kb) → specific imports (-35kb)
  3. charts (45kb) → lazy load (-45kb initial)
```

**React Performance:**
- Missing React.memo detection
- Expensive computation memoization
- Unnecessary re-render identification
- Code-splitting recommendations
- Tree-shaking validation

---

### dx-orchestrator

**Scaffolding:**
```bash
pnpm new:component Button  # Generates with Plop.js
pnpm new:hook useAuth      # Creates custom hook
pnpm new:pattern Repository # Scaffolds design pattern
```

**IDE Configuration:**
- VS Code snippets with intelligent placeholders
- JetBrains live templates
- ESLint auto-fix on save
- Prettier integration
- Launch configurations

**Workspace Scripts:**
```json
{
  "scripts": {
    "dev": "turbo dev --parallel",
    "test": "turbo test --filter=...{origin/main}",
    "lint:fix": "turbo lint --fix"
  }
}
```

---

### agent-orchestrator

**Cognitive Patterns:**
- **Convergent:** Analytical, optimization, debugging
- **Divergent:** Creative, UI/UX design, alternatives
- **Lateral:** Paradigm shifts, breakthrough solutions
- **Systems:** Architecture, integration, holistic view
- **Critical:** Evaluation, risk assessment, trade-offs
- **Abstract:** Frameworks, patterns, generalization

**Anticipatory Development:**
```typescript
user: "I set up the API service for analytics"

agent-orchestrator analyzes context → predicts needs:
1. Data visualization components
2. Error handling infrastructure
3. Loading states
4. Data transformation utilities
5. Integration tests

→ Creates proactively before being asked
```

---

## 🔧 Installation

```bash
# In your project
mkdir -p .claude
cd .claude

# Clone agents
git clone https://github.com/YOUR_USERNAME/claude-agents.git agents

# Or copy individual agents as needed
```

---

## 💡 Usage Examples

### Example 1: Building a New Feature
```
user: "I need to add a user profile page with avatar upload"

→ agent-orchestrator decomposes:
  - Workstream 1: ProfileCard component (component-generator)
  - Workstream 2: Upload component (component-generator)
  - Workstream 3: API integration (dx-orchestrator scaffolds service)
  - Workstream 4: Tests (component-generator)
  
→ Anticipates: Form validation, image optimization, loading states
→ Creates complete feature in coordinated fashion
```

### Example 2: Performance Optimization
```
user: "Dashboard is slow and bundle is 600kb"

→ monorepo-optimizer analyzes:
  1. Bundle: Identifies moment.js (72kb), lodash (48kb), unused code
  2. Rendering: Detects missing React.memo on DashboardGrid
  3. Code-splitting: Recommends lazy loading charts

→ Provides specific fixes with estimated impact
→ New bundle: 320kb, renders 60% faster
```

### Example 3: Component Creation + Review
```
user: "Create a Modal component"

→ component-generator creates:
  - Modal with compound components (Header, Body, Footer)
  - Focus trap and ESC key handling
  - Accessibility (ARIA, role="dialog")
  - Tests (rendering, keyboard, a11y)
  - Storybook stories

→ Automatically validates:
  - Architecture (compound pattern ✅)
  - Theme (uses design tokens ✅)
  - Tests (95% coverage ✅)
  - Accessibility (WCAG AA ✅)
```

---

## 📝 Contributing

When proposing new agents:
1. Ensure unique functionality (no overlap with existing agents)
2. Clear, specific purpose
3. Comprehensive documentation
4. Real-world testing

---

## 🔄 Updates

```bash
cd .claude/agents
git pull origin main
```

---

## 📄 License

MIT License - Free to use and modify.

---

## 🎯 Project Context

**SaaSaaS Project** (SaaS-as-a-Service CLI)
- Current Branch: `feat/week1-cli-foundation`
- Phase: Week 1 - CLI Foundation
- Tech Stack: TypeScript, pnpm monorepo, Fastify, PostgreSQL/SQLite, Redis, NATS

See `CLAUDE.md` for full project documentation.

---

**Agent Collection Version:** 2.0 (Consolidated)
**Last Updated:** 2025-10-31
**Total Agents:** 5 (optimized from 15+)
