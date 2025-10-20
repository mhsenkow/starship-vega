# 🎨 Border Radius Design System Guide

## Overview

The border radius system is designed with **component intent** in mind, providing consistent and purposeful rounding across all UI elements. Each component type has specific border radius values that match its functional purpose and visual hierarchy.

## 🎯 Design Philosophy

- **Interactive Elements**: Subtle rounding (2-6px) for usability without being distracting
- **Content Containers**: More pronounced rounding (8-12px) to create visual separation
- **Feedback Elements**: Pill-shaped rounding (9999px) for badges and tags
- **Layout Sections**: Moderate rounding (12-16px) for main content areas

## 📏 Base Scale

```css
--radius-xs: 2px;    /* Very subtle rounding */
--radius-sm: 4px;    /* Small elements like inputs */
--radius-base: 6px;  /* Default button radius */
--radius-md: 8px;    /* Cards and panels */
--radius-lg: 12px;   /* Larger containers */
--radius-xl: 16px;   /* Section containers */
--radius-2xl: 20px;  /* Hero sections */
--radius-3xl: 24px;  /* Large modal/overlay */
--radius-full: 9999px; /* Pills and circular elements */
```

## 🧩 Component Intent System

### Interactive Elements
```css
/* Buttons */
--radius-intent-button-primary: 6px;     /* Main action buttons */
--radius-intent-button-secondary: 4px;   /* Secondary buttons */
--radius-intent-button-pill: 9999px;     /* Pill buttons */
--radius-intent-button-icon: 4px;        /* Icon buttons */

/* Form Elements */
--radius-intent-input-default: 4px;      /* Text inputs */
--radius-intent-input-search: 6px;       /* Search bars */
--radius-intent-input-select: 4px;       /* Dropdowns */
--radius-intent-input-checkbox: 2px;     /* Checkboxes */
--radius-intent-input-radio: 9999px;     /* Radio buttons */
```

### Content Containers
```css
/* Cards */
--radius-intent-card-default: 8px;       /* Standard cards */
--radius-intent-card-elevated: 12px;     /* Elevated cards */
--radius-intent-card-compact: 4px;       /* Compact cards */

/* Charts */
--radius-intent-chart-container: 8px;    /* Chart containers */
--radius-intent-chart-card: 6px;         /* Chart cards */
--radius-intent-chart-legend: 4px;       /* Chart legends */
```

### Navigation & Layout
```css
/* Navigation */
--radius-intent-navigation-tab: 4px;     /* Tabs */
--radius-intent-navigation-breadcrumb: 2px; /* Breadcrumbs */
--radius-intent-navigation-menu: 6px;    /* Dropdown menus */
--radius-intent-navigation-header: 0px;  /* Headers */

/* Sections */
--radius-intent-section-container: 12px; /* Main sections */
--radius-intent-section-panel: 8px;      /* Side panels */
--radius-intent-section-hero: 16px;      /* Hero sections */
```

### Feedback Elements
```css
/* Badges */
--radius-intent-badge-default: 9999px;   /* Pill badges */
--radius-intent-badge-square: 2px;       /* Square badges */
--radius-intent-badge-rounded: 6px;      /* Rounded badges */

/* Overlays */
--radius-intent-modal-default: 12px;     /* Standard modals */
--radius-intent-modal-large: 16px;       /* Large modals */
--radius-intent-modal-fullscreen: 0px;   /* Fullscreen modals */

/* Special Elements */
--radius-intent-tooltip: 4px;            /* Tooltips */
--radius-intent-toast: 6px;              /* Toast notifications */
--radius-intent-avatar: 9999px;          /* Avatars */
--radius-intent-progress: 9999px;        /* Progress bars */
```

## 🚀 Quick Reference Aliases

For common use cases, we provide convenient aliases:

```css
--radius-button: var(--radius-intent-button-primary);
--radius-input: var(--radius-intent-input-default);
--radius-card: var(--radius-intent-card-default);
--radius-badge: var(--radius-intent-badge-default);
--radius-modal: var(--radius-intent-modal-default);
--radius-tooltip: var(--radius-intent-tooltip);
--radius-chart-card: var(--radius-intent-chart-card);
--radius-chart-container: var(--radius-intent-chart-container);
--radius-section: var(--radius-intent-section-container);
--radius-panel: var(--radius-intent-section-panel);
```

## 💻 Usage Examples

### CSS Modules
```css
.button {
  border-radius: var(--radius-button);
}

.card {
  border-radius: var(--radius-card);
}

.badge {
  border-radius: var(--radius-badge);
}

.chartContainer {
  border-radius: var(--radius-chart-container);
}
```

### Component Tokens (JavaScript/TypeScript)
```typescript
import { designTokens } from '../design-system/tokens';

const buttonStyles = {
  borderRadius: designTokens.borderRadiusIntent.button.primary,
};

const cardStyles = {
  borderRadius: designTokens.borderRadiusIntent.card.default,
};
```

### Specific Intent Usage
```css
/* For a pill-style button */
.pillButton {
  border-radius: var(--radius-intent-button-pill);
}

/* For an elevated card */
.elevatedCard {
  border-radius: var(--radius-intent-card-elevated);
}

/* For a search input */
.searchInput {
  border-radius: var(--radius-intent-input-search);
}
```

## 🎨 Visual Hierarchy

The border radius system creates a clear visual hierarchy:

1. **Minimal (2-4px)**: Form elements, small interactive components
2. **Moderate (6-8px)**: Buttons, standard cards, navigation elements
3. **Pronounced (12-16px)**: Main content sections, modals, elevated surfaces
4. **Pill (9999px)**: Badges, tags, avatars, circular elements

## 🔄 Migration Guide

If you're updating existing components:

1. **Replace generic border-radius values** with intent-based ones
2. **Use component-specific tokens** when available
3. **Prefer aliases** for common use cases
4. **Test visual consistency** across your application

### Before:
```css
.button {
  border-radius: 8px; /* Generic value */
}

.card {
  border-radius: 12px; /* Generic value */
}
```

### After:
```css
.button {
  border-radius: var(--radius-button); /* Intent-based */
}

.card {
  border-radius: var(--radius-card); /* Intent-based */
}
```

## 🎯 Best Practices

1. **Use intent-based tokens** rather than arbitrary values
2. **Maintain consistency** within component families
3. **Consider visual hierarchy** when choosing border radius values
4. **Test accessibility** - ensure rounded corners don't interfere with usability
5. **Document custom usage** when deviating from the system

This system ensures that your border radius choices are intentional, consistent, and maintainable across your entire application.
