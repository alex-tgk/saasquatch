# Final Implementation Prompt Template

## Status

⚠️ **This is a TEMPLATE** - Will be finalized after user answers questions in `04-user-questions.md`

---

## Implementation Prompt Structure

Once you provide answers to the strategic questions, this template will be filled in to create a comprehensive, actionable prompt for building the SaaSaaS CLI tool.

---

## Section 1: Project Context

```markdown
# Build SaaS-as-a-Service (SaaSaaS) CLI Tool

## Project Overview

Create a production-ready CLI tool that generates complete microservices architectures for SaaS applications. The tool should allow developers to rapidly bootstrap modern, scalable platforms with all essential infrastructure components.

## Core Requirements

**User answers will fill in these sections:**

### Selected Framework(s)
- Primary: [USER SELECTION]
- Performance option: [USER SELECTION]
- Real-time option: [USER SELECTION]

### Infrastructure Choices
- Cache: [USER SELECTION]
- Database: [USER SELECTION]
- Message Queue: [USER SELECTION]
- Deployment Target: [USER SELECTION]

### Project Scope
- Timeline: [USER SELECTION]
- Target Users: [USER SELECTION]
- MVP Features: [DERIVED FROM ANSWERS]
- Phase 2 Features: [DERIVED FROM ANSWERS]
```

---

## Section 2: Technical Architecture

```markdown
## System Architecture

### CLI Tool Stack
- **CLI Framework**: Commander.js + Inquirer.js
- **Code Generator**: Plop.js
- **Template Engine**: Handlebars
- **Package Manager**: [USER SELECTION]

### Microservice Framework(s)
[Generated based on user framework choices]

### Infrastructure Services
[Generated based on user infrastructure choices]

### Monorepo Strategy
[Based on user preference: monorepo vs multi-repo]
```

---

## Section 3: Feature Specifications

```markdown
## Core Features (MVP)

### 1. Project Initialization
**Command**: `saasquatch init`

**Functionality**:
- Interactive prompts for project configuration
- Generate project structure
- Setup infrastructure services
- Configure development environment
- Initialize git repository

**Generated Output**:
[Detailed structure based on user choices]

### 2. Service Generation
**Command**: `saasquatch add service`

**Functionality**:
[Based on selected framework and options]

### 3. CRUD Generation
**Command**: `saasquatch generate crud`

**Functionality**:
[Standard CRUD with user-selected features]

### 4. Integration Management
**Command**: `saasquatch add integration`

**Functionality**:
[Based on selected infrastructure options]

### 5. Development Environment
**Command**: `saasquatch dev`

**Functionality**:
[Based on user's dev environment preference]
```

---

## Section 4: Claude Code Integration

```markdown
## Claude Agents

### Priority 1 Agents (MVP)
[List based on user's top 5 selections from Q9]

1. **[Agent 1]**
   - Purpose: [Description]
   - Triggers: [Conditions]
   - Capabilities: [What it does]

2. **[Agent 2]**
   - Purpose: [Description]
   - Triggers: [Conditions]
   - Capabilities: [What it does]

[Continue for all Priority 1 agents]

### Priority 2 Agents (Phase 2)
[Remaining agents based on priorities]

### Skills Library
[Generated based on framework and infrastructure choices]

### Custom Commands
[Based on user's command naming preference from Q10]
```

---

## Section 5: Code Generation Strategy

```markdown
## Template Structure

```
cli/templates/
├── frameworks/
│   ├── [selected-framework-1]/
│   ├── [selected-framework-2]/  # if multi-framework
│   └── [selected-framework-3]/  # if multi-framework
├── infrastructure/
│   ├── [selected-cache]/
│   ├── [selected-database]/
│   └── [selected-message-queue]/
├── deployment/
│   └── [selected-deployment-target]/
└── ci-cd/
    └── [selected-cicd-provider]/
```

## Code Quality Requirements

### Testing
[Based on Q13 answer]
- Unit tests: [yes/no with details]
- Integration tests: [yes/no with details]
- E2E tests: [yes/no with details]
- Coverage goal: [percentage]

### Documentation
[Based on Q14 answer]
- [Selected documentation types]

### Code Standards
- TypeScript strict mode: enabled
- ESLint: [configuration]
- Prettier: [configuration]
- Husky git hooks: [enabled/disabled]
```

---

## Section 6: Development Workflow

```markdown
## Developer Experience

### CLI Interactivity
[Based on Q11 answer]
- Interactive mode: [yes/no]
- Config file support: [yes/no]
- Smart defaults: [yes/no]

### Development Environment
[Based on Q12 answer]
- Services run: [locally/docker]
- Infrastructure: [docker/local]
- Hot reload: enabled

### Monitoring & Observability
[Based on Q18 answer]
- Logging: [selected solution]
- Metrics: [selected solution]
- Tracing: [selected solution]
```

---

## Section 7: Deployment & Operations

```markdown
## Deployment Strategy

### Primary Target
[Based on Q19 answer]
- Platform: [selection]
- Configuration: [details]

### CI/CD
[Based on Q20 answer]
- Provider: [selection]
- Pipeline stages: [list]
- Automation level: [basic/standard/comprehensive]

### Authentication
[Based on Q15 answer]
- Strategy: [selection]
- Implementation: [details]

### Service Discovery
[Based on Q17 answer]
- Mechanism: [selection]
- Configuration: [details]
```

---

## Section 8: Implementation Plan

```markdown
## Phase 1: MVP (Weeks 1-4)

### Week 1: Foundation
- [ ] Setup CLI project structure
- [ ] Implement Commander + Inquirer integration
- [ ] Create basic Plop.js generators
- [ ] Setup Handlebars templates for [selected framework]

### Week 2: Core Generation
- [ ] Implement project initialization
- [ ] Implement service generation
- [ ] Create infrastructure templates for:
  - [selected cache]
  - [selected database]
  - [selected message queue - if applicable]
- [ ] Setup Docker Compose templates

### Week 3: Advanced Features
- [ ] Implement CRUD generator
- [ ] Implement integration adder
- [ ] Generate comprehensive tests (if selected)
- [ ] Setup CI/CD templates (if selected)

### Week 4: Claude Integration
- [ ] Implement top 3 priority agents
- [ ] Create 5-10 core skills
- [ ] Setup custom commands
- [ ] Test end-to-end workflows

**Deliverable**: Working MVP that can generate [selected framework] microservices

## Phase 2: Expansion (Weeks 5-8)
[Generated based on Phase 2 selections]

## Phase 3: Polish (Weeks 9-12)
[Generated based on Phase 3 selections]
```

---

## Section 9: Success Criteria

```markdown
## MVP Success Metrics

1. **Speed**: Generate working 3-service architecture in < 5 minutes
2. **Quality**: Generated code passes linting and tests
3. **Completeness**: All core features working
4. **Documentation**: Users can follow README to get started
5. **Claude Integration**: At least 3 agents working effectively

## User Acceptance Criteria

Based on target user [from Q3]:
- [Criteria 1]
- [Criteria 2]
- [Criteria 3]

## Performance Targets

- CLI startup time: < 1 second
- Service generation time: < 30 seconds
- Full project initialization: < 2 minutes (excluding npm install)
```

---

## Section 10: Testing Strategy

```markdown
## CLI Testing

### Unit Tests
- Test all CLI commands
- Test all generators
- Test template rendering
- Coverage goal: 80%+

### Integration Tests
- Test full project generation
- Test service addition
- Test CRUD generation
- Test infrastructure integration

### E2E Tests
- Test complete workflows
- Generate project → Add service → Generate CRUD → Run tests
- Deploy to Docker Compose
- Verify all services running

## Generated Code Testing

[Based on Q13 answer]
- [Testing details for generated services]
```

---

## Section 11: Documentation Requirements

```markdown
## User Documentation

### Getting Started
- Installation guide
- Quick start tutorial
- First project walkthrough

### Reference
- Command reference
- Configuration options
- Template customization
- Agent documentation

### Guides
- Framework-specific guides
- Deployment guides
- Best practices
- Troubleshooting

### Community
[If open source from Q1]
- Contributing guidelines
- Code of conduct
- Issue templates
```

---

## Section 12: Open Questions & Constraints

```markdown
## Constraints

### Technical
- [From Q21: Tools to avoid]
- [From Q23: Budget considerations]

### Timeline
- [From Q2: Target timeline]

### Scope
- [From Q24: Other requirements]

## Optimization Focus

[From Q22: Specific use cases]
- Use case 1: [Optimizations]
- Use case 2: [Optimizations]
```

---

## How This Template Will Be Used

After you answer the questions in `04-user-questions.md`, I will:

1. **Fill in all [USER SELECTION] placeholders** with your answers
2. **Generate specific implementation details** based on your choices
3. **Create prioritized task lists** aligned with your timeline
4. **Specify exact technologies and versions** for your stack
5. **Detail agent specifications** based on your priorities
6. **Create example code** showing expected outputs
7. **Define success metrics** matching your goals

The result will be a **complete, actionable implementation prompt** that can be used to start building immediately.

---

## Next Steps

1. ✅ You've reviewed the research documents
2. ⏳ **Now**: Answer questions in `04-user-questions.md`
3. 🔄 **Then**: I'll generate your personalized implementation prompt
4. 🚀 **Finally**: Begin development with clear direction!

---

**Status**: Template ready, awaiting user input
**Estimated template completion time**: 10-15 minutes after receiving answers
**Final prompt size**: ~2000-3000 lines (comprehensive)
