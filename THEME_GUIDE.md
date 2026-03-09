# Theme Palette System Guide

## Overview
The theme palette system allows you to customize the entire look and feel of your application through the configuration file. Each deployment can have its own unique theme with custom colors, typography, spacing, and effects.

## Theme Structure

The theme is defined in `config.json` under the `theme` property and includes:

### 1. Colors
Complete color palette including:
- **Primary colors** - Main brand colors (primary, primaryLight, primaryDark)
- **Secondary colors** - Supporting brand colors
- **Accent colors** - Highlight and call-to-action colors
- **Background colors** - Page and container backgrounds
- **Surface colors** - Card and component backgrounds
- **Text colors** - Typography colors for different contexts
- **Status colors** - Success, warning, error, info states
- **Border colors** - Dividers and outlines

### 2. Typography
Font settings including:
- **Font families** - Body, heading, and monospace fonts
- **Font sizes** - XS to 4XL scale (0.75rem to 3rem)
- **Font weights** - Light (300) to Bold (700)
- **Line heights** - Tight to loose spacing
- **Letter spacing** - Character spacing options

### 3. Spacing
Layout and spacing values:
- **Spacing scale** - XS to 4XL (0.25rem to 6rem)
- **Border radius** - None to full rounded
- **Shadows** - SM to 2XL elevation levels

### 4. Effects
Visual effects and transitions:
- **Transitions** - Fast, base, and slow durations
- **Opacity** - Disabled, hover, and active states
- **Z-index** - Layering for dropdowns, modals, tooltips, etc.

## Using Theme Variables

The theme service automatically creates CSS custom properties from your theme configuration. You can use these in your stylesheets:

### In SCSS/CSS
```scss
.my-component {
  // Colors
  background: var(--color-primary);
  color: var(--color-text-on-primary);
  border: 1px solid var(--color-border);
  
  // Typography
  font-family: var(--font-family);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-normal);
  
  // Spacing
  padding: var(--spacing-md);
  margin: var(--spacing-lg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  
  // Effects
  transition: var(--transition-base);
  opacity: var(--opacity-hover);
  z-index: var(--z-index-dropdown);
}
```

### In TypeScript
```typescript
import { ThemeService } from './services/theme.service';

export class MyComponent {
  constructor(private themeService: ThemeService) {}
  
  ngOnInit() {
    // Get specific color
    const primaryColor = this.themeService.getColor('primary');
    
    // Get CSS variable reference
    const colorVar = this.themeService.getColorVar('primary');
    
    // Get all colors
    const colors = this.themeService.getColors();
    
    // Get typography settings
    const typography = this.themeService.getTypography();
  }
}
```

## Available Themes

### 1. Purple Dream (Default)
**File:** `config.json`
- **Primary:** Purple (#667eea)
- **Secondary:** Deep Purple (#764ba2)
- **Accent:** Pink (#f093fb)
- **Style:** Modern, vibrant, creative

### 2. Ocean Blue (Production)
**File:** `config.production.json`
- **Primary:** Sky Blue (#0ea5e9)
- **Secondary:** Cyan (#06b6d4)
- **Accent:** Violet (#8b5cf6)
- **Style:** Professional, calm, trustworthy

## Creating Custom Themes

### Step 1: Define Your Theme
Create a new config file (e.g., `config.custom.json`) or modify an existing one:

```json
{
  "theme": {
    "name": "My Custom Theme",
    "colors": {
      "primary": "#your-color",
      "primaryLight": "#lighter-shade",
      "primaryDark": "#darker-shade",
      // ... all other color properties
    },
    "typography": {
      // ... typography settings
    },
    "spacing": {
      // ... spacing settings
    },
    "effects": {
      // ... effects settings
    }
  }
}
```

### Step 2: Deploy with Your Theme
```bash
# Copy your custom config before building
cp public/config.custom.json public/config.json
npm run build
```

## Theme Color Palette Generator

When creating a custom theme, ensure you define all required color properties:

**Required Color Properties:**
- primary, primaryLight, primaryDark
- secondary, secondaryLight, secondaryDark
- accent, accentLight, accentDark
- background, backgroundLight, backgroundDark
- surface, surfaceLight, surfaceDark
- textPrimary, textSecondary, textDisabled
- textOnPrimary, textOnSecondary
- success, warning, error, info
- border, borderLight, borderDark

**Tip:** Use online tools like:
- [Coolors.co](https://coolors.co/) - Color palette generator
- [Adobe Color](https://color.adobe.com/) - Color wheel and harmony
- [Material Design Color Tool](https://material.io/resources/color/) - Material palette generator

## Best Practices

### 1. Maintain Contrast Ratios
Ensure text colors have sufficient contrast against backgrounds:
- Normal text: minimum 4.5:1 ratio
- Large text: minimum 3:1 ratio
- Use tools like [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

### 2. Consistent Color Usage
- Use `primary` for main actions and brand elements
- Use `secondary` for supporting actions
- Use `accent` for highlights and CTAs
- Use status colors (success, warning, error) consistently

### 3. Typography Scale
Maintain a consistent type scale:
- Use heading fonts for titles
- Use body fonts for content
- Use monospace for code
- Keep line heights readable (1.5 for body text)

### 4. Spacing Consistency
Use the spacing scale consistently:
- `xs/sm` for tight spacing (buttons, inputs)
- `md/lg` for comfortable spacing (cards, sections)
- `xl/2xl/3xl` for generous spacing (page sections)

### 5. Accessibility
- Ensure color is not the only means of conveying information
- Provide sufficient contrast for all text
- Test with screen readers and keyboard navigation

## Theme Examples

### Corporate Theme
```json
{
  "name": "Corporate Blue",
  "colors": {
    "primary": "#003366",
    "secondary": "#0066cc",
    "accent": "#ff6600",
    // Professional, conservative palette
  }
}
```

### Eco/Green Theme
```json
{
  "name": "Eco Green",
  "colors": {
    "primary": "#2d6a4f",
    "secondary": "#52b788",
    "accent": "#95d5b2",
    // Nature-inspired, sustainable feel
  }
}
```

### Dark Theme
```json
{
  "name": "Dark Mode",
  "colors": {
    "primary": "#3b82f6",
    "background": "#1e293b",
    "surface": "#334155",
    "textPrimary": "#f1f5f9",
    // Dark mode optimized
  }
}
```

## Troubleshooting

### Theme Not Applying
1. Check browser console for errors
2. Verify `config.json` has valid JSON syntax
3. Ensure all required theme properties are defined
4. Clear browser cache and reload

### Colors Look Wrong
1. Verify hex color codes are valid (#RRGGBB format)
2. Check CSS custom properties in browser DevTools
3. Ensure no hardcoded colors override theme variables

### Performance Issues
1. Theme is loaded once at startup - no performance impact
2. CSS custom properties are highly performant
3. Avoid inline styles that override theme variables

## Summary

The theme palette system provides:
- ✅ Complete visual customization through config
- ✅ CSS custom properties for easy styling
- ✅ Type-safe theme access in TypeScript
- ✅ Multiple theme examples included
- ✅ No code changes needed for different themes
- ✅ Perfect for multi-tenant deployments
