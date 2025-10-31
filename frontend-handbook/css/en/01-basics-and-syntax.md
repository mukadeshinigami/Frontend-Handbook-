---
title: "Code Breakdown 01 — CSS Basics and Syntax"
description: "Practical code breakdown: CSS fundamentals through real examples"
lesson: 1
previous_topics: []
new_concepts: ["syntax-structure", "selectors-basic", "properties-values", "cascade", "inheritance"]
---

**Current Topic:** CSS Basics and Syntax  
**Previously Covered:** None (first lesson)  
**New Concepts:** Syntax, selectors, properties, cascade, inheritance

---

## Example Code

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CSS Basics Demo</title>
  <style>
    /* Type selector targets all paragraphs */
    p {
      color: #333;
      line-height: 1.6;
    }
    
    /* Class selector - reusable style */
    .highlight {
      background: yellow;
      padding: 0.25rem;
    }
    
    /* Cascade: later rule overrides */
    p {
      color: #555; /* This wins */
    }
  </style>
</head>
<body>
  <p>Regular paragraph with inherited line-height.</p>
  <p class="highlight">Highlighted paragraph.</p>
</body>
</html>
```

---

## Breakdown (80% new)

### Syntax Structure

```css
selector {
  property: value;
}
```

- **Selector** (`p`): targets elements
- **Property** (`color`): what to style
- **Value** (`#333`): how to style it
- **Declaration**: property + value + semicolon

### Basic Selectors

1. **Type selector** (`p`): matches all `<p>` elements
2. **Class selector** (`.highlight`): matches elements with `class="highlight"`
3. **ID selector** (`#main`): matches element with `id="main"` (not shown)

### Properties and Values

```css
p {
  color: #333;        /* Text color (hex) */
  line-height: 1.6;   /* Spacing between lines */
}
```

Common value types:
- Colors: `#333`, `rgb(0,0,0)`, `blue`
- Lengths: `1rem`, `16px`, `50%`
- Numbers: `1.6` (unitless for line-height)

### The Cascade

When multiple rules target the same element, later rules override earlier ones:

```css
p { color: #333; }  /* Applied first */
p { color: #555; }  /* Overrides previous */
```

Result: paragraphs are `#555`.

### Inheritance

Children inherit certain properties from parents:

```css
p {
  line-height: 1.6;  /* Inherited by nested spans */
}
```

**Inherited:** `color`, `font-family`, `line-height`  
**Not inherited:** `padding`, `background`, `border`

---

## Key Patterns

1. **External stylesheet** (production):
```html
<link rel="stylesheet" href="styles.css">
```

2. **Internal stylesheet** (demos/prototypes):
```html
<style>
  /* CSS here */
</style>
```

3. **Class-based styling** (maintainable):
```css
.btn { /* reusable button style */ }
```

---

## Practice Exercise

Create `demo.html`:
1. Add internal `<style>` block
2. Style all headings with `color: navy;`
3. Create `.box` class with `padding: 1rem; border: 1px solid #ccc;`
4. Apply `.box` to a `<div>` and observe

**Next:** Selectors deep-dive (specificity, combinators, pseudo-classes)
