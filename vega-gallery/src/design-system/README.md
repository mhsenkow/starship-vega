# 🎨 Design System Documentation

## Overview

This design system provides a comprehensive set of tokens, components, and utilities for building consistent, accessible, and beautiful user interfaces. It follows Material Design 3 principles with robust fallbacks and supports multiple themes.

## 🎯 Key Features

- **8 Theme Variants**: Light, Dark, Fluent, Neon, Material 3, Neumorphism, Brutalist, Retro
- **Comprehensive Token System**: Colors, spacing, typography, shadows, and component-specific tokens
- **CSS Custom Properties**: All tokens available as CSS variables
- **Accessibility First**: Proper contrast ratios and focus states
- **Component Library**: Pre-built components following design system principles

## 🎨 Color System

### Primary Colors
- **Primary**: `#2196f3` (Blue) - Main brand color for primary actions
- **Secondary**: `#9c27b0` (Purple) - Secondary actions and accents  
- **Tertiary**: `#9e9e9e` (Gray) - Subtle actions and disabled states

### Semantic Colors
- **Success**: `#4caf50` (Green) - Success states, confirmations
- **Warning**: `#ffc107` (Amber) - Warnings, cautions
- **Error**: `#f44336` (Red) - Errors, destructive actions
- **Info**: `#03a9f4` (Cyan) - Information, neutral actions

### Usage Examples

```css
/* Primary button */
.button-primary {
  background: var(--color-primary);
  color: var(--color-text-inverse);
}

/* Secondary button */
.button-secondary {
  background: var(--color-secondary);
  color: var(--color-text-inverse);
}

/* Tertiary button */
.button-tertiary {
  background: var(--color-tertiary-light);
  color: var(--color-tertiary-dark);
}
```

## 📏 Spacing System

Based on an 8pt grid system for consistent spacing:

```css
--spacing-0: 0px;
--spacing-0-5: 2px;   /* 0.125rem */
--spacing-1: 4px;     /* 0.25rem */
--spacing-2: 8px;     /* 0.5rem */
--spacing-3: 12px;    /* 0.75rem */
--spacing-4: 16px;    /* 1rem */
--spacing-5: 20px;    /* 1.25rem */
--spacing-6: 24px;    /* 1.5rem */
--spacing-8: 32px;    /* 2rem */
--spacing-10: 40px;   /* 2.5rem */
--spacing-12: 48px;   /* 3rem */
--spacing-16: 64px;   /* 4rem */
--spacing-20: 80px;   /* 5rem */
--spacing-24: 96px;   /* 6rem */
--spacing-32: 128px;  /* 8rem */
```

### Usage Examples

```css
.card {
  padding: var(--spacing-6);        /* 24px */
  margin-bottom: var(--spacing-4);  /* 16px */
  gap: var(--spacing-2);            /* 8px */
}
```

## 🔤 Typography System

### Font Families
- **Primary**: System fonts with fallbacks for optimal performance
- **Mono**: Monospace fonts for code and data

### Font Sizes
```css
--typography-fontSize-xs: 0.75rem;   /* 12px */
--typography-fontSize-sm: 0.875rem;  /* 14px */
--typography-fontSize-base: 1rem;     /* 16px */
--typography-fontSize-lg: 1.125rem;  /* 18px */
--typography-fontSize-xl: 1.25rem;   /* 20px */
--typography-fontSize-2xl: 1.5rem;   /* 24px */
--typography-fontSize-3xl: 1.875rem; /* 30px */
--typography-fontSize-4xl: 2.25rem;  /* 36px */
--typography-fontSize-5xl: 3rem;     /* 48px */
```

### Font Weights
```css
--typography-fontWeight-light: 300;
--typography-fontWeight-regular: 400;
--typography-fontWeight-medium: 500;
--typography-fontWeight-semibold: 600;
--typography-fontWeight-bold: 700;
```

## 🎭 Theme System

### Available Themes
1. **Light** - Modern, clean, and accessible
2. **Dark** - Sophisticated and easy on the eyes
3. **Fluent** - Microsoft glassmorphism design
4. **Neon** - Cyberpunk electric aesthetic
5. **Material 3** - Google's dynamic design system
6. **Neumorphism** - Soft, tactile UI design
7. **Brutalist** - Raw, industrial, no-compromise
8. **Retro** - Warm vintage nostalgia

### Theme Usage

```tsx
import { useThemeContext } from '../styles/ThemeProvider.module';

function MyComponent() {
  const { mode, setTheme } = useThemeContext();
  
  return (
    <div>
      <button onClick={() => setTheme('dark')}>
        Switch to Dark Mode
      </button>
    </div>
  );
}
```

## 🧩 Component System

### Button Variants

```tsx
import { Button } from '../design-system';

// Primary button (highest hierarchy)
<Button variant="primary">Primary Action</Button>

// Secondary button (medium hierarchy)  
<Button variant="secondary">Secondary Action</Button>

// Tertiary button (lowest hierarchy)
<Button variant="tertiary">Tertiary Action</Button>

// Danger button
<Button variant="danger">Delete</Button>

// Success button
<Button variant="success">Save</Button>
```

### Button Sizes

```tsx
<Button size="small">Small</Button>
<Button size="medium">Medium</Button>
<Button size="large">Large</Button>
```

### Icon Buttons

```tsx
import { IconButton } from '../design-system';

<IconButton iconOnly>
  <Icon name="close" />
</IconButton>
```

## 🎨 Best Practices

### 1. Always Use Design Tokens
❌ **Don't do this:**
```css
.button {
  padding: 16px;
  color: #2196f3;
  border-radius: 8px;
}
```

✅ **Do this:**
```css
.button {
  padding: var(--spacing-4);
  color: var(--color-primary);
  border-radius: var(--radius-base);
}
```

### 2. Follow Color Hierarchy
- **Primary**: Main actions, CTAs, important elements
- **Secondary**: Secondary actions, navigation
- **Tertiary**: Subtle actions, disabled states
- **Semantic**: Use success/warning/error for appropriate states

### 3. Use Consistent Spacing
Always use the spacing scale instead of arbitrary values:

```css
.card {
  padding: var(--spacing-6);        /* ✅ Good */
  margin: var(--spacing-4);         /* ✅ Good */
  
  /* ❌ Avoid */
  padding: 23px;
  margin: 17px;
}
```

### 4. Leverage Theme System
Components automatically adapt to theme changes. Don't hardcode theme-specific values:

```css
.surface {
  background: var(--color-surface-primary);  /* ✅ Adapts to theme */
  color: var(--color-text-primary);         /* ✅ Adapts to theme */
  
  /* ❌ Don't hardcode */
  background: #ffffff;
  color: #000000;
}
```

## 🔧 Development Guidelines

### Adding New Components

1. **Use Design Tokens**: Always reference design tokens instead of hardcoded values
2. **Follow Naming Conventions**: Use consistent CSS class naming
3. **Support All Themes**: Ensure components work across all theme variants
4. **Accessibility First**: Include proper focus states and ARIA attributes
5. **Document Usage**: Add examples and prop documentation

### Extending the Design System

1. **Add Tokens First**: Define new tokens in `tokens.ts`
2. **Update CSS Variables**: Add corresponding CSS custom properties
3. **Test Across Themes**: Ensure new tokens work in all theme variants
4. **Update Documentation**: Keep this README current

## 🚀 Getting Started

1. **Import the Design System**:
```tsx
import { Button, Card, Typography } from '../design-system';
```

2. **Use CSS Variables**:
```css
.my-component {
  padding: var(--spacing-4);
  background: var(--color-surface-primary);
  color: var(--color-text-primary);
}
```

3. **Leverage Theme Context**:
```tsx
import { useThemeContext } from '../styles/ThemeProvider.module';
```

## 📚 Additional Resources

- [Material Design 3 Guidelines](https://m3.material.io/)
- [CSS Custom Properties MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Need help?** Check the component examples in `/src/components/` or refer to the design system tokens in `/src/design-system/tokens.ts`.
