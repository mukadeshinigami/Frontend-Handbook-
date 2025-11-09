# HTML Basics and Structure

## Introduction

HTML (HyperText Markup Language) is a markup language used to create the structure of web pages. HTML is used together with CSS (for styling) and JavaScript (for interactivity).

---

## Basic HTML Document Structure

Every HTML document should contain a specific structure:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Title</title>
  </head>
  <body>
    <h1>Welcome!</h1>
    <p>Page content goes here</p>
  </body>
</html>
```

### Breaking Down the Elements:

| Element | Description |
|---------|-------------|
| `<!DOCTYPE html>` | Document type declaration (HTML5) |
| `<html>` | Root element, contains all content |
| `<head>` | Meta information about the document (not visible to users) |
| `<body>` | Visible content of the page |

---

## The `<head>` Element

This section contains meta-information about the page.

### Important `<head>` Elements:

#### 1. `<meta charset="UTF-8">`
Specifies character encoding (mandatory for proper text display):
```html
<meta charset="UTF-8">
```

#### 2. `<meta name="viewport">`
Controls scaling on mobile devices (important for responsive design):
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

#### 3. `<title>`
Page title displayed in the browser tab:
```html
<title>My First Web Page</title>
```

#### 4. `<meta name="description">`
Brief page description for search engines:
```html
<meta name="description" content="This is my page description for SEO">
```

#### 5. `<link>`
Linking external resources (CSS, fonts, icons):
```html
<link rel="stylesheet" href="styles.css">
<link rel="icon" href="favicon.ico">
```

#### 6. `<style>`
Embedded CSS styles:
```html
<style>
  body { background-color: #f0f0f0; }
</style>
```

#### 7. `<script>`
Linking JavaScript:
```html
<script src="script.js"></script>
```

---

## The `<body>` Element

Contains all visible content of the page.

### Main Body Elements:

#### Headings
```html
<h1>Main heading (most important)</h1>
<h2>Subheading</h2>
<h3>Sub-subheading</h3>
<!-- ... up to <h6> -->
```

**Best Practices:**
- Only one `<h1>` per page
- Use headings in order (don't skip levels)
- Use headings for structure, not styling

#### Paragraphs
```html
<p>This is a regular paragraph of text.</p>
<p>This is another paragraph.</p>
```

#### Line Breaks and Horizontal Rules
```html
<p>First line<br>Second line</p>
<hr> <!-- Horizontal line -->
```

#### Text Formatting
```html
<strong>Important text (bold)</strong>
<em>Emphasized text (italic)</em>
<small>Small text</small>
<mark>Highlighted text (background)</mark>
<del>Deleted text</del>
<ins>Inserted text</ins>
<sub>Subscript</sub>
<sup>Superscript</sup>
```

---

## Practical Example

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="My first web page">
    <title>Hello World - My First Page</title>
  </head>
  <body>
    <h1>Welcome to my website!</h1>
    <p>
      This is my <strong>first web page</strong>. 
      I'm using HTML to create the structure.
    </p>
    
    <h2>About This Page</h2>
    <p>
      This page demonstrates the <em>basic concepts</em> of HTML.
    </p>
    
    <hr>
    
    <h2>Information</h2>
    <p>
      Water boils at 100°C<sup>*</sup> at sea level.
    </p>
    <small>*At standard atmospheric pressure</small>
  </body>
</html>
```

---

## Common Attributes

Attributes provide additional information about elements:

```html
<!-- id: unique identifier -->
<h1 id="main-title">Heading</h1>

<!-- class: for styling and grouping -->
<p class="intro">Introductory text</p>

<!-- style: inline styles -->
<p style="color: blue;">Blue text</p>

<!-- title: tooltip on hover -->
<p title="This is a tooltip">Hover over me</p>

<!-- data-*: custom data attributes -->
<div data-user-id="123">User content</div>
```

---

## Semantic HTML

Use semantic elements to improve accessibility and SEO:

```html
<header>
  <h1>Website Header</h1>
  <nav>Navigation</nav>
</header>

<main>
  <article>
    <h2>Article Title</h2>
    <p>Article content</p>
  </article>
  
  <aside>
    <h3>Sidebar</h3>
    <p>Additional information</p>
  </aside>
</main>

<footer>
  <p>&copy; 2025 My Website</p>
</footer>
```

---

## HTML Validation

To check the correctness of your HTML:
- **[W3C Validator](https://validator.w3.org/)** — official validator
- **IDE extensions** — automatic validation in your editor
- **Browser DevTools** — check via console

---

## Beginner's Checklist

- ✅ Always use `<!DOCTYPE html>`
- ✅ Set the correct `UTF-8` encoding
- ✅ Include `<meta name="viewport">` for mobile devices
- ✅ Use meaningful `<title>`
- ✅ Structure content with headings (h1-h6)
- ✅ Use semantic elements
- ✅ Validate your HTML
- ✅ Always close your tags properly

---

## Useful Resources

- [MDN: HTML Basics](https://developer.mozilla.org/en-US/docs/Learn/HTML)
- [W3C HTML Specification](https://html.spec.whatwg.org/)
- [Can I Use](https://caniuse.com/) — browser compatibility

