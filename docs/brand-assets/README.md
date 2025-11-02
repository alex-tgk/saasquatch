# SaaSQuatch Brand Assets

This directory contains all brand assets and guidelines for SaaSQuatch.

## 📄 Available Documents

### Main Brand Guidelines
- **`../brand-theme.md`** - Comprehensive brand theme documentation (Markdown)
- **`../brand-guidelines.pdf`** - Professional PDF brand guidelines (Print-ready)
- **`../brand-guidelines.html`** - HTML version of brand guidelines

## 🎨 Brand Quick Reference

### Colors

**Primary Colors:**
- Steel Blue 600: `#475569` - Primary brand color
- Royal Blue 600: `#2563EB` - Accent color for CTAs

**Neutrals:**
- Slate 50: `#F8FAFC` - Backgrounds
- Slate 700: `#334155` - Body text
- Slate 900: `#0F172A` - Dark text

**Semantic:**
- Success: `#10B981` (Emerald 500)
- Warning: `#F59E0B` (Amber 500)
- Error: `#EF4444` (Red 500)

### Typography

**Primary Font:** Inter
- UI, headings, body text, marketing content
- Weights: 400, 500, 600, 700, 800

**Code Font:** JetBrains Mono
- Code blocks, CLI output, technical examples
- Weights: 400, 500, 600

### Logo

**Text Logo:** `SaaSQuatch`
- Steel Blue 600 on light backgrounds
- White on dark backgrounds
- Minimum width: 120px (digital) / 1 inch (print)

### Tagline

**"Enterprise-Grade Microservices for Ambitious Teams"**

## 📦 Asset Categories

### Logos (To Be Created)
```
logos/
├── saasquatch-logo.svg          # Full color vector
├── saasquatch-logo-dark.svg     # Dark variant
├── saasquatch-logo-mono.svg     # Monochrome
├── saasquatch-icon.svg          # Icon/symbol mark
└── favicon/
    ├── favicon.ico              # 32x32, 16x16
    ├── favicon-16x16.png
    ├── favicon-32x32.png
    └── apple-touch-icon.png
```

### Social Media (To Be Created)
```
social/
├── og-image.png                 # 1200×630 (Open Graph)
├── twitter-card.png             # 1200×600
└── linkedin-cover.png           # 1584×396
```

### Marketing (To Be Created)
```
marketing/
├── hero-background.svg          # Website hero section
├── feature-icons/               # SVG icons for features
└── screenshots/                 # Product screenshots
```

### Documentation (To Be Created)
```
docs/
├── readme-banner.svg            # GitHub README header
└── diagrams/                    # Architecture diagrams
```

## 🎯 Brand Positioning

**Core Message:** Enterprise-Grade Tools for Ambitious Startups

**Brand Promise:** Complete. Powerful. Approachable.

**Brand Archetype:** The Mentor - Experienced, knowledgeable, supportive

**Voice & Tone:** Helpful & Guiding with Professional Authority

## ✅ Do's

- Use Steel Blue and Royal Blue as primary colors
- Maintain consistent typography (Inter + JetBrains Mono)
- Use helpful, guiding language
- Show real code examples with syntax highlighting
- Emphasize production-readiness and best practices
- Provide clear, actionable error messages
- Use emoji sparingly (✓ ✗ 💡 🚀)

## ❌ Don'ts

- Use bright or neon colors
- Mix too many font families
- Use condescending or gatekeeping language
- Show incomplete or "TODO" code examples
- Overpromise ("revolutionary", "game-changing")
- Use angry or aggressive error messages
- Overuse emojis
- Clutter interfaces

## 📝 Content Guidelines

### Writing Principles
1. **Clarity over cleverness** - Say what you mean
2. **Active voice** - "SaaSQuatch generates..."
3. **Present tense** - "The CLI creates..."
4. **Second person** - "You can configure..."
5. **Specific over generic** - Use exact tool names

### Error Message Structure
**Format:** Problem → Impact → Solution

Example:
```
❌ JWT_SECRET not set

Your app is using the default JWT secret, which isn't secure for production.

Fix: Set the JWT_SECRET environment variable:
export JWT_SECRET=$(openssl rand -base64 32)
```

## 🔗 Resources

- **Full Brand Guidelines:** See `../brand-guidelines.pdf`
- **Detailed Documentation:** See `../brand-theme.md`
- **Web Version:** See `../brand-guidelines.html`

## 📞 Contact

For questions about brand guidelines, open an issue on GitHub.

---

**Version:** 1.0
**Last Updated:** November 2025
**Status:** Active

This is a living document. Suggest improvements via pull request.
