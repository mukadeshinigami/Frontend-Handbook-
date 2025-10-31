---
title: "01 — CSS Basics and Syntax"
description: "Concise introduction to CSS: what it is, how to connect it, syntax rules, cascade, and inheritance."
lesson: 1
previous_topics: []
new_concepts: ["CSS purpose", "connection methods", "syntax structure", "cascade", "inheritance", "comments"]
---

# Lesson 1: CSS Basics and Syntax

**Current Topic:** CSS Fundamentals  
**Previously Covered:** None (first lesson)  
**New Concepts:** What CSS is, connection methods, syntax, cascade, inheritance

---

## What is CSS?

CSS (Cascading Style Sheets) controls the visual presentation of HTML documents. It separates content (HTML) from design (CSS).

**Purpose:**
- Style elements (colors, fonts, spacing)
- Layout pages (positioning, flexbox, grid)
- Create responsive designs
- Add animations and transitions

---

## Three Ways to Connect CSS

### 1. Inline CSS
Directly in HTML elements via `style` attribute.

```html
<p style="color: blue; font-size: 16px;">Inline styled text</p>
```

**Use case:** Quick tests, overrides (avoid in production).

### 2. Internal CSS
Inside `<style>` tag in `<head>`.

```html
<head>
  <style>
    p { color: blue; }
  </style>
</head>
```

**Use case:** Single-page styles, small projects.

### 3. External CSS (Recommended)
Separate `.css` file linked via `<link>`.

```html
<head>
  <link rel="stylesheet" href="styles.css">
</head>
```

**File: styles.css**
```css
p { color: blue; }
```

**Use case:** Production, scalability, caching.

---

## CSS Syntax

```css
selector {
  property: value;
  property: value;
}
```

**Example:**
```css
h1 {
  color: #333;
  font-size: 2rem;
  margin-bottom: 1rem;
}
```

**Components:**
- **Selector** (`h1`): targets HTML elements
- **Property** (`color`): aspect to style
- **Value** (`#333`): setting for property
- **Declaration** (`color: #333;`): property + value + semicolon

---

## Comments

```css
/* Single-line comment */

/*
  Multi-line
  comment block
*/

p {
  color: red; /* Inline comment */
}
```

---

## The Cascade

Multiple rules can target the same element. CSS applies them based on:

1. **Specificity** (more specific selectors win)
2. **Source order** (later rules override earlier)
3. **Importance** (`!important` flag)

**Example:**
```css
p { color: blue; }      /* Applied first */
p { color: green; }     /* Overrides previous */
```

Result: paragraphs are green.

---

## Inheritance

Some properties pass from parent to child elements automatically.

**Inherited properties:** `color`, `font-family`, `line-height`, `text-align`  
**Not inherited:** `margin`, `padding`, `border`, `background`

**Example:**
```html
<div style="color: red;">
  <p>This text is red (inherited)</p>
</div>
```

Force inheritance:
```css
button {
  font-family: inherit; /* Inherits from parent */
}
```

---

## Quick Reference

| Concept | Summary |
|---------|---------|
| **Purpose** | Separate presentation from content |
| **Connection** | Inline, internal, external (prefer external) |
| **Syntax** | `selector { property: value; }` |
| **Cascade** | Specificity + order determine applied styles |
| **Inheritance** | Some properties pass to children |
| **Comments** | `/* comment */` |

---

## Practice

1. Create `index.html` and link external `styles.css`
2. Style a heading with custom color and size
3. Test cascade by writing duplicate rules
4. Observe inheritance with nested elements

**Next Lesson Preview:** Selectors and specificity (targeting elements precisely).
