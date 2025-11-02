# Brand Compliance for Workflows

**All agents and automated workflows MUST follow SaaSQuatch brand guidelines.**

---

## 🎯 Quick Compliance Check

Before generating any user-facing content, ask:

1. **Is this user-facing?** (Documentation, CLI output, error messages, UI, comments)
2. **Does it use brand colors?** (Exact hex codes from palette)
3. **Does it use brand fonts?** (Inter or JetBrains Mono)
4. **Is the voice correct?** (Helpful & Guiding, not condescending)
5. **Is the writing clear?** (Active voice, present tense, second person)

If YES to #1, then verify #2-5.

---

## 📋 Automated Workflow Brand Requirements

### Git Commit Messages

**Format**:
```
feat: [concise description]

- [Detail 1]
- [Detail 2]

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

**Voice**: Direct, active, present tense
**Example**:
```
✓ feat: add JWT secret validation to auth plugin
✗ feat: added some validation stuff
```

### PR Descriptions

**Format**:
```markdown
## Summary
- [Bullet point 1 - what was changed]
- [Bullet point 2 - impact]

## Test plan
- [ ] Task 1
- [ ] Task 2

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

**Voice**: Helpful & Guiding
**Example**:
```
✓ "Added security validation to prevent default JWT secrets in production"
✗ "Some security stuff was added"
```

### CLI Command Output

**Must use brand symbols**:
```bash
✓ Success message (green)
✗ Error message (red)
⚠ Warning message (yellow)
ℹ Info message (blue)
💡 Tip or helpful hint
📚 Documentation reference
🚀 Next step suggestion
```

**Must use brand voice**:
```bash
✓ "Let's configure your database connection"
✗ "Configuring database... please wait"

✓ "Your auth service is ready on http://localhost:3001"
✗ "Service started"
```

### Generated Documentation

**README Structure**:
```markdown
# [Project Name]

[One-line description following brand voice]

## Quick Start

[2-minute setup guide]

## Features

- ✓ [Feature 1 with benefit]
- ✓ [Feature 2 with benefit]

> 💡 **Tip**: [Helpful context]

## Documentation

📚 [Link to docs]
```

**Code Examples**:
- Use dark theme code blocks
- Include complete, runnable examples
- Add helpful comments
- Show expected output

---

## 🎨 Color Usage in Workflows

### Status Colors

When generating status indicators, use:

```css
/* Success - Emerald 500 */
--success-color: #10B981;

/* Warning - Amber 500 */
--warning-color: #F59E0B;

/* Error - Red 500 */
--error-color: #EF4444;

/* Info - Sky 500 */
--info-color: #0EA5E9;

/* Primary Action - Royal Blue 600 */
--primary-color: #2563EB;
```

### Terminal Output Colors

When using ANSI color codes in CLI:
```javascript
// Brand-compliant terminal colors
const colors = {
  success: '\x1b[32m',   // Green for ✓
  error: '\x1b[31m',     // Red for ✗
  warning: '\x1b[33m',   // Yellow for ⚠
  info: '\x1b[36m',      // Cyan for ℹ
  primary: '\x1b[34m',   // Blue for brand
  reset: '\x1b[0m'
};
```

---

## 📝 Error Message Generation

### Template

```
[Symbol] [PROBLEM_TITLE]

[Clear explanation of what's wrong and why it matters]

Fix: [Actionable solution with example]
[Optional command or code snippet]

[Optional: Link to documentation]
```

### Examples

**✓ Good Error Message**:
```
❌ JWT_SECRET environment variable not set

Your application is using the default JWT secret ('your-super-secret-jwt-key'),
which is not secure for production deployments.

Fix: Set a strong JWT secret in your .env file:
export JWT_SECRET=$(openssl rand -base64 32)

📚 Learn more: https://saasquatch.dev/docs/security/jwt
```

**✗ Bad Error Message**:
```
Error: JWT secret invalid
```

---

## 🔧 Generated Code Comments

### User-Facing Comments

**Must follow brand voice**:

```typescript
// ✓ GOOD: Helpful & Guiding
/**
 * Validates JWT configuration on startup.
 *
 * In production, this ensures you're not using the default JWT secret,
 * which would be a security risk. Generate a secure secret with:
 * `openssl rand -base64 32`
 */
```

```typescript
// ✗ BAD: Condescending or unclear
/**
 * Checks JWT stuff. Don't use the default secret, obviously.
 */
```

### Internal Code Comments

Internal comments (not shown to users) can be more technical and don't need to follow brand voice strictly, but should still be clear and helpful.

---

## 📚 Documentation Generation

### Section Headers

Use consistent formatting:
```markdown
## Main Section

### Subsection

#### Component-Level Heading
```

### Code Blocks

Always specify language for syntax highlighting:
````markdown
```typescript
// TypeScript code here
```

```bash
# Shell commands here
```
````

### Callouts

Use branded callout boxes:
```markdown
> 💡 **Tip**: [Helpful information]

> ⚠️ **Warning**: [Important caution]

> 📚 **Documentation**: [Reference link]
```

---

## 🎯 UI Component Generation

### Component Templates

When generating UI components, use:

**Buttons**:
```typescript
// Primary button
className="bg-royal-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-royal-blue-700"

// Secondary button
className="border-2 border-steel-blue-600 text-steel-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-slate-50"
```

**Cards**:
```typescript
// Elevated card
className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"

// Flat card
className="bg-slate-50 rounded-lg p-5"
```

**Typography**:
```typescript
// Heading
className="font-inter font-bold text-3xl text-slate-900"

// Body text
className="font-inter text-base text-slate-700 leading-relaxed"

// Code
className="font-jetbrains-mono text-sm bg-slate-100 px-2 py-1 rounded text-steel-blue-700"
```

---

## ✅ Pre-Commit Checklist

Before committing generated content:

- [ ] All user-facing text follows brand voice
- [ ] Colors use exact hex codes from brand palette
- [ ] Typography uses Inter or JetBrains Mono
- [ ] Error messages follow Problem → Impact → Solution format
- [ ] CLI output uses approved symbols
- [ ] Documentation is clear and helpful
- [ ] Code examples are complete and runnable
- [ ] No condescending or gatekeeping language
- [ ] Components follow brand specifications

---

## 🔄 Brand Update Process

When brand guidelines are updated:

1. **Read**: Review updated guidelines in `docs/brand-theme.md`
2. **Update**: Modify this compliance guide
3. **Notify**: Alert active workflows and agents
4. **Audit**: Review recently generated content
5. **Fix**: Update non-compliant content
6. **Document**: Note changes in commit messages

---

## 📞 Questions?

- **Full Guidelines**: See `docs/brand-theme.md`
- **PDF Version**: See `docs/brand-guidelines.pdf`
- **Quick Reference**: See `.claude/BRAND-GUIDELINES-REFERENCE.md`
- **Issues**: Open a GitHub issue for clarification

---

**Last Updated**: November 2025
**Applies To**: All automated workflows, agents, and code generation
**Status**: MANDATORY
