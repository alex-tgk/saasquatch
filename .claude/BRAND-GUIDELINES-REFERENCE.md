# Brand Guidelines Reference for Agents & Workflows

**Version:** 1.0
**Last Updated:** November 2025
**Status:** MANDATORY for all content generation

---

## ⚠️ CRITICAL: When to Follow Brand Guidelines

All agents and workflows MUST follow brand guidelines when generating:

✅ **User-Facing Content**:
- Documentation (README, guides, tutorials)
- CLI output and terminal messages
- Error messages and warnings
- Help text and usage instructions
- Generated code comments (user-facing)
- Template files that users will see
- Dashboard UI components
- Marketing content

✅ **Code Generation**:
- HTML/CSS in generated templates
- UI component styling
- Color variables and themes
- Typography settings
- Error message text

---

## 🎨 Brand Quick Reference

### Brand Identity

**Positioning**: "Enterprise-Grade Tools for Ambitious Startups"
**Promise**: Complete. Powerful. Approachable.
**Archetype**: The Mentor (experienced, supportive, guiding)

### Voice & Tone

**Style**: Helpful & Guiding with Professional Authority

**Characteristics**:
- Clear and direct, not verbose
- Confident but not arrogant
- Helpful without being condescending
- Technical but accessible
- Solution-focused, not problem-focused

**DO Say**:
- "Let's set up your production-ready auth service"
- "We've included security validation to prevent common mistakes"
- "Generate a microservices architecture in under 2 minutes"

**DON'T Say**:
- "Warning: You're doing it wrong!"
- "This revolutionary tool will change everything!"
- "Finally, a tool that doesn't suck"

### Colors (Use Exact Hex Codes)

**Primary Palette**:
```css
/* Brand Colors */
--steel-blue-600: #475569;  /* Primary brand color */
--royal-blue-600: #2563EB;  /* Accent, CTAs, links */

/* Backgrounds */
--slate-50: #F8FAFC;   /* Light backgrounds */
--white: #FFFFFF;      /* Primary backgrounds */

/* Text */
--slate-900: #0F172A;  /* Darkest text, headings */
--slate-800: #1E293B;  /* Dark text */
--slate-700: #334155;  /* Body text */
--slate-600: #475569;  /* Secondary text */
--slate-500: #64748B;  /* Tertiary text */
--slate-400: #94A3B8;  /* Placeholder text */

/* Borders */
--slate-200: #E2E8F0;  /* Borders, dividers */
--slate-300: #CBD5E1;  /* Disabled states */
```

**Semantic Colors**:
```css
/* Status Colors */
--success: #10B981;  /* Emerald 500 */
--warning: #F59E0B;  /* Amber 500 */
--error: #EF4444;    /* Red 500 */
--info: #0EA5E9;     /* Sky 500 */
```

### Typography

**Font Stack**:
```css
/* Primary - UI & Content */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

/* Secondary - Code & Technical */
font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', Monaco, Consolas, monospace;
```

**Font Weights**:
- 400: Regular (body text)
- 500: Medium (emphasis)
- 600: SemiBold (headings, buttons)
- 700: Bold (display headings)

**Type Scale**:
```css
/* Headings */
--text-display: 48px / 3rem;       /* Hero, font-weight: 700 */
--text-h1: 36px / 2.25rem;         /* Page title, font-weight: 700 */
--text-h2: 30px / 1.875rem;        /* Section, font-weight: 600 */
--text-h3: 24px / 1.5rem;          /* Subsection, font-weight: 600 */
--text-h4: 20px / 1.25rem;         /* Component, font-weight: 500 */

/* Body */
--text-body-lg: 18px / 1.125rem;   /* Large body, font-weight: 400 */
--text-body: 16px / 1rem;          /* Default body, font-weight: 400 */
--text-body-sm: 14px / 0.875rem;   /* Small body, font-weight: 400 */
--text-caption: 12px / 0.75rem;    /* Captions, font-weight: 400 */

/* Code */
--text-code: 14px / 0.875rem;      /* Inline/block code, font-weight: 400 */
--text-cli: 13px / 0.8125rem;      /* CLI output, font-weight: 400 */
```

---

## 📝 Writing Guidelines

### General Principles

1. **Clarity over cleverness** - Say what you mean directly
2. **Active voice** - "SaaSQuatch generates..." not "Projects are generated..."
3. **Present tense** - "The CLI creates..." not "The CLI will create..."
4. **Second person** - "You can configure..." not "Developers can configure..."
5. **Specific over generic** - "JWT authentication with @fastify/jwt" not "security features"

### Error Message Structure

**Format**: Problem → Impact → Solution

**Template**:
```
❌ [PROBLEM_TITLE]

[Explanation of what's wrong and why it matters]

Fix: [Clear, actionable solution]
[Optional: Command or code example]
```

**Example**:
```
❌ JWT_SECRET not set

Your app is using the default JWT secret, which isn't secure for production.

Fix: Set the JWT_SECRET environment variable:
export JWT_SECRET=$(openssl rand -base64 32)
```

### CLI Output Style

**Success Messages**:
```bash
✓ Database connected successfully
✓ Redis cache ready
✓ Auth service running on http://localhost:3001
```

**Progress Indicators**:
```bash
⠋ Installing dependencies...
⠙ Generating service files...
⠹ Configuring database...
✓ Project created successfully!
```

**Helpful Tips**:
```bash
💡 Tip: Run 'pnpm dev' to start all services
📚 Docs: https://saasquatch.dev/docs
🚀 Next: Configure your .env file
```

**Use Symbols Sparingly**:
- ✓ Success
- ✗ Error
- ⚠ Warning
- ℹ Info
- 💡 Tip
- 📚 Documentation
- 🚀 Next step

---

## 🎯 UI Component Guidelines

### Buttons

**Primary Button**:
```css
background: #2563EB;      /* Royal Blue 600 */
color: #FFFFFF;
padding: 12px 24px;
border-radius: 8px;
font-weight: 600;
font-size: 16px;
font-family: 'Inter', sans-serif;

hover: background: #1D4ED8;  /* Royal Blue 700 */
```

**Secondary Button**:
```css
background: transparent;
border: 2px solid #475569;  /* Steel Blue 600 */
color: #475569;
padding: 10px 22px;
border-radius: 8px;
font-weight: 600;
font-size: 16px;

hover: background: #F8FAFC;  /* Slate 50 */
```

### Cards

**Elevated Card**:
```css
background: #FFFFFF;
border: 1px solid #E2E8F0;  /* Slate 200 */
border-radius: 12px;
padding: 24px;
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
```

**Flat Card**:
```css
background: #F8FAFC;  /* Slate 50 */
border-radius: 8px;
padding: 20px;
```

### Code Blocks

**Dark Theme (Preferred)**:
```css
background: #0F172A;  /* Slate 900 */
color: #E2E8F0;       /* Slate 200 */
padding: 16px;
border-radius: 8px;
font-family: 'JetBrains Mono', monospace;
font-size: 14px;
line-height: 1.6;
```

**Light Theme**:
```css
background: #F8FAFC;  /* Slate 50 */
color: #1E293B;       /* Slate 800 */
border: 1px solid #E2E8F0;  /* Slate 200 */
padding: 16px;
border-radius: 8px;
font-family: 'JetBrains Mono', monospace;
```

**Inline Code**:
```css
background: #F1F5F9;  /* Slate 100 */
color: #334155;       /* Steel Blue 700 */
padding: 2px 6px;
border-radius: 4px;
font-family: 'JetBrains Mono', monospace;
font-size: 14px;
```

---

## 📄 Documentation Templates

### README Header

```markdown
<div align="center">
  <h1>SaaSQuatch</h1>
  <p>Enterprise-Grade Microservices for Ambitious Teams</p>

  [![npm version](https://img.shields.io/npm/v/@saasquatch/cli)](https://npmjs.com/package/@saasquatch/cli)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://typescriptlang.org/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
</div>
```

### Quick Start Section

```markdown
## Quick Start

Generate a production-ready microservices architecture in **under 2 minutes**.

\`\`\`bash
npx @saasquatch/cli init my-project
cd my-project
pnpm dev
\`\`\`

✓ That's it! Your services are running with:
- JWT authentication
- PostgreSQL database
- Redis cache
- NATS message queue
- Health checks
- Structured logging

> 💡 **Tip**: All services include security validation to prevent common production mistakes.
```

### Code Example Template

````markdown
### Example: Create Auth Service

\`\`\`bash
# Generate new project
npx @saasquatch/cli init my-app

# Select features
? Which database? › PostgreSQL
? Include authentication? › Yes (JWT)
? Include caching? › Yes (Redis)
\`\`\`

Your auth service includes:
- ✓ JWT token generation and validation
- ✓ Password hashing with bcrypt
- ✓ Secure session management
- ✓ Production-ready error handling
````

---

## 🚫 Common Mistakes to Avoid

### ❌ DON'T

**Overly Technical Jargon** (without context):
```
❌ "Instantiate the auth middleware singleton"
✅ "Set up JWT authentication for your service"
```

**Condescending Tone**:
```
❌ "Obviously, you need to set environment variables first"
✅ "First, configure your environment variables in .env"
```

**Vague Instructions**:
```
❌ "Configure your database"
✅ "Set DATABASE_URL in your .env file:
    DATABASE_URL=postgresql://user:pass@localhost:5432/db"
```

**Passive Voice**:
```
❌ "The services are generated by the CLI"
✅ "SaaSQuatch generates your services"
```

**Using Wrong Colors**:
```
❌ background: #FF0000; /* Random red */
✅ background: #EF4444; /* Error red from palette */
```

**Wrong Font Families**:
```
❌ font-family: Arial, sans-serif;
✅ font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
```

---

## ✅ Implementation Checklist

When generating any user-facing content, verify:

- [ ] Colors use exact hex codes from brand palette
- [ ] Typography uses Inter or JetBrains Mono
- [ ] Voice is "Helpful & Guiding" (The Mentor)
- [ ] Writing follows the 5 principles (clarity, active, present, second person, specific)
- [ ] Error messages follow Problem → Impact → Solution format
- [ ] CLI output uses approved symbols (✓ ✗ ⚠ ℹ 💡 📚 🚀)
- [ ] Documentation includes helpful context, not just commands
- [ ] Code examples are complete and runnable
- [ ] No condescending or gatekeeping language
- [ ] Buttons/cards follow component specifications

---

## 📚 Full Documentation

For complete brand guidelines, see:
- **Comprehensive Guide**: `docs/brand-theme.md`
- **PDF Guidelines**: `docs/brand-guidelines.pdf`
- **Quick Reference**: `docs/brand-assets/README.md`

---

## 🔄 Updates

This is a living document. When brand guidelines are updated:
1. Update this reference file
2. Notify all active agents/workflows
3. Review and update existing generated content
4. Update templates to reflect changes

---

**Last Reviewed**: November 2025
**Maintained By**: Project maintainers
**Questions?**: Refer to full brand guidelines or open an issue
