---
title: "Code Breakdown 01 — CSS Basics and Syntax"
description: "Detailed breakdown of practical CSS example demonstrating selectors, cascade, inheritance, and core patterns"
lesson: 1
previous_topics: []
new_concepts: ["selectors", "cascade", "inheritance", "specificity", "pseudo-classes", "pseudo-elements"]
demo_file: "01-basics-and-syntax.html"
---

**Current Topic:** CSS Basics through Practical Code  
**Previously Covered:** None (first lesson)  
**New Concepts:** Selectors, cascade, inheritance, specificity, box model basics

---

## Demo File Overview

Open `01-basics-and-syntax.html` to see all concepts in action. This breakdown explains each pattern used.

---

## Core Concepts (80% new content)

### 1. Basic Selectors

**Type selector** — targets all elements of a type:
```css
h1 {
  color: #2c3e50;
  font-size: 2rem;
}
```
Applied to every `<h1>` element.

**Class selector** — reusable, targets elements with matching class:
```css
.intro {
  background: #ecf0f1;
  padding: 1rem;
}
```
Used on: `<div class="intro">...</div>`

**ID selector** — unique element, high specificity:
```css
#highlight {
  background: yellow;
}
```
Used on: `<span id="highlight">...</span>`

### 2. The Cascade

When multiple rules target the same element, CSS applies them based on specificity and order:

```css
.text {
  color: #7f8c8d; /* Base color */
}

.text.important {
  color: #e74c3c; /* More specific — wins */
  font-weight: bold;
}
```

Element with `class="text important"` gets red color because `.text.important` (2 classes) is more specific than `.text` (1 class).

**Specificity scoring:**
- ID: `#highlight` = (1,0,0)
- Class: `.intro` = (0,1,0)
- Type: `h1` = (0,0,1)
- Combined: `.text.important` = (0,2,0)

### 3. Inheritance

Some properties automatically pass from parent to children:

```css
body {
  font-family: system-ui, sans-serif;
  line-height: 1.6;
  color: #333;
}
```

All text inside `<body>` inherits these values unless explicitly overridden.

**Inherited properties:** `color`, `font-family`, `line-height`, `text-align`  
**Not inherited:** `margin`, `padding`, `border`, `background`

### 4. Combinators

**Descendant selector** (space) — targets nested elements at any depth:
```css
.box h2 {
  color: #16a085;
}
```
Selects all `<h2>` inside `.box`, regardless of nesting level.

### 5. Pseudo-classes and Pseudo-elements

**Pseudo-class** — style based on state:
```css
.box:hover {
  border-color: #3498db;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
```
Applies only when mouse hovers over `.box`.

**Pseudo-element** — style specific part of element:
```css
.features li::before {
  content: "✓";
  color: #27ae60;
}
```
Inserts content before each `<li>` in `.features` list.

---

## Key Patterns in Demo

### Reset and Box Sizing
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
```
Universal selector (`*`) resets browser defaults. `box-sizing: border-box` makes width calculations predictable.

### Responsive Design
```css
@media (max-width: 600px) {
  body { padding: 1rem; }
  h1 { font-size: 1.5rem; }
}
```
Styles inside `@media` apply only when viewport is ≤600px wide.

### Transitions for Smooth Interactions
```css
.box:hover {
  transition: all 0.3s ease;
}
```
Animates property changes over 0.3 seconds.

---

## Code Structure Analysis

### HTML Structure
```html
<div class="box">
  <h2>Title</h2>
  <p>Content</p>
</div>
```

### Applied CSS
1. `.box` — border, padding, margin
2. `.box h2` — nested heading color (descendant selector)
3. `.box:hover` — hover state styling

### Why This Works
- Semantic HTML classes (`.intro`, `.box`, `.features`)
- Reusable styles through classes
- Progressive enhancement (hover effects optional)
- Clear specificity hierarchy

---

## Practice Exercises

1. **Modify selectors:**
   - Change `.intro` background to `#d5f4e6`
   - Add a new class `.warning` with red border

2. **Test cascade:**
   - Add rule `.text { color: blue; }` after existing `.text` rule
   - Observe which color wins

3. **Experiment with specificity:**
   - Try styling `#highlight` with a class `.highlight`
   - See which selector takes precedence

4. **Add pseudo-elements:**
   - Create `p::first-letter { font-size: 2em; }`
   - Add decorative elements with `::after`

---

## Common Patterns Demonstrated

| Pattern | Example | Use Case |
|---------|---------|----------|
| Type selector | `h1 {}` | Global element styling |
| Class selector | `.box {}` | Reusable components |
| ID selector | `#highlight {}` | Unique elements, JS hooks |
| Descendant | `.box h2 {}` | Nested element styling |
| Pseudo-class | `.box:hover {}` | Interactive states |
| Pseudo-element | `li::before {}` | Generated content |
| Media query | `@media (max-width: 600px) {}` | Responsive layouts |

---

## Next Steps

- Open demo file in browser (F12 DevTools)
- Inspect each element to see applied styles
- Modify CSS values and observe changes
- Try creating similar patterns in your own code

**Next Lesson:** Selectors deep-dive (attribute selectors, nth-child, advanced combinators)
