import React from 'react';

// Reusable Article component
// Props:
// - title: string
// - intro: string (optional paragraph)
// - items: array of strings (optional ordered list)
// - imageSrc: string (optional image URL shown above the article)
// - children: custom JSX content that will be rendered between intro and list
export default function Article({ title, intro, items = [], imageSrc, children }) {
  return (
    <>
      {imageSrc && (
        <img
          src={imageSrc}
          alt={title}
          style={{ maxWidth: '100%', height: 'auto', marginBottom: 12, borderRadius: 8 }}
        />
      )}

      <article>
        <h1>{title}</h1>
        {intro && <p>{intro}</p>}

        {children}

        {Array.isArray(items) && items.length > 0 && (
          <ol>
            {items.map((it, i) => (
              <li key={i}>{it}</li>
            ))}
          </ol>
        )}
      </article>
    </>
  );
}
