# Claude Configuration for SaaSQuatch

This directory contains Claude-specific configurations, agents, skills, and workflows for the SaaSQuatch project.

---

## 📁 Directory Structure

```
.claude/
├── README.md                          # This file
├── BRAND-GUIDELINES-REFERENCE.md      # Quick brand reference for agents
├── agents/                            # Agent definitions
├── commands/                          # Slash commands
│   ├── git/                          # Git workflow commands
│   ├── skill/                        # Skill management
│   └── workflow/                     # Worktree workflow commands
├── skills/                           # Claude skills library
└── workflows/                        # Workflow documentation
    └── BRAND-COMPLIANCE.md           # Brand compliance for workflows
```

---

## ⚠️ CRITICAL: Brand Guidelines

**ALL agents, workflows, and generated content MUST follow SaaSQuatch brand guidelines.**

### Quick Reference

**Brand Identity**: Enterprise-Grade Tools for Ambitious Startups
**Voice**: Helpful & Guiding with Professional Authority (The Mentor)
**Colors**: Steel Blue 600 (#475569) + Royal Blue 600 (#2563EB)
**Fonts**: Inter (UI) + JetBrains Mono (Code)

### Required Reading

Before generating any user-facing content:

1. **Quick Reference**: `.claude/BRAND-GUIDELINES-REFERENCE.md`
2. **Full Guidelines**: `docs/brand-theme.md`
3. **Compliance Guide**: `.claude/workflows/BRAND-COMPLIANCE.md`

### When Brand Guidelines Apply

✅ **MUST follow** for:
- Documentation (README, guides, tutorials)
- CLI output and terminal messages
- Error messages and help text
- Generated templates (UI, comments)
- NPM package descriptions
- Marketing content

❌ **Not required** for:
- Internal code logic
- Test files
- Build configurations

---

## 🤖 Available Agents

Agents are specialized AI assistants for specific tasks. See `.claude/agents/` for available agents.

### Using Agents

Agents are automatically invoked by Claude Code when appropriate for the task.

---

## ⚡ Slash Commands

Quick commands for common workflows. Use `/help` to see all available commands.

### Git Workflow
- `/git:cm` - Stage all and commit
- `/git:cp` - Stage, commit, and push
- `/git:pr [to] [from]` - Create pull request

### Worktree Workflow
- `/workflow:create <branch>` - Create new worktree
- `/workflow:switch <branch>` - Switch to worktree
- `/workflow:list` - List all worktrees
- `/workflow:dashboard` - Show worktree status
- `/workflow:sync` - Sync all worktrees with main
- `/workflow:remove <branch>` - Remove worktree
- `/workflow:push-all` - Push all worktree branches

### Skills
- `/skill:create [prompt]` - Create new skill

---

## 🎓 Skills

Skills provide specialized knowledge and capabilities. See `.claude/skills/README.md` for all available skills.

### Featured Skills
- **docs-seeker** - Find and fetch technical documentation
- **chrome-devtools** - Browser automation and debugging
- **cloudflare** - Cloudflare platform development
- **docker** - Container development
- **mongodb** - MongoDB database operations
- **nextjs** - Next.js development
- **shadcn-ui** - shadcn/ui component library

---

## 📝 Workflows

Documented workflows for common development patterns.

### Brand Compliance
See `.claude/workflows/BRAND-COMPLIANCE.md` for:
- Color usage in workflows
- Error message templates
- Documentation generation
- UI component generation
- Pre-commit checklist

---

## 🎨 Brand Quick Reference

### Colors (Exact Hex Codes)

```css
/* Primary */
--steel-blue-600: #475569;  /* Brand primary */
--royal-blue-600: #2563EB;  /* Accent, CTAs */

/* Text */
--slate-900: #0F172A;  /* Headings */
--slate-700: #334155;  /* Body */

/* Semantic */
--success: #10B981;
--warning: #F59E0B;
--error: #EF4444;
```

### Typography

```css
/* UI & Content */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

/* Code & Technical */
font-family: 'JetBrains Mono', 'Fira Code', monospace;
```

### Voice & Tone

**DO**:
- "Let's set up your production-ready auth service"
- "We've included security validation"
- Clear, direct, helpful

**DON'T**:
- "You're doing it wrong"
- "This revolutionary tool"
- Condescending, hyperbolic

---

## 📚 Documentation

### Project Documentation
- **CLAUDE.md** - Main Claude instructions (in project root)
- **docs/brand-theme.md** - Complete brand guidelines
- **docs/brand-guidelines.pdf** - PDF brand guide

### Workflow Documentation
- **docs/WORKTREE-WORKFLOW.md** - Git worktree workflow
- **docs/task-keeper.md** - Task management system

---

## ✅ Before You Start

When working on the SaaSQuatch project:

1. **Read**: `CLAUDE.md` in project root
2. **Review**: Brand guidelines (`.claude/BRAND-GUIDELINES-REFERENCE.md`)
3. **Understand**: Voice and tone (Helpful & Guiding)
4. **Check**: Color and typography requirements
5. **Verify**: Generated content follows brand

---

## 🔄 Updates

This configuration is a living document. When making changes:

1. Update relevant documentation
2. Notify team members
3. Review existing content for compliance
4. Document changes in commit messages

---

## 📞 Support

- **Brand Questions**: See `docs/brand-theme.md`
- **Workflow Questions**: See `.claude/workflows/`
- **General Questions**: Open a GitHub issue

---

**Last Updated**: November 2025
**Maintained By**: Project maintainers
