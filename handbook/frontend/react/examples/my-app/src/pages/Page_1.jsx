import React from 'react';
import Article from '../components/Article.jsx';
export default function Page_1() {
  return (
    <Article
      title="Welcome to Page 1"
      intro="This is the introduction paragraph for Page 1."
      items={['First item', 'Second item', 'Third item']}
      imageSrc="https://i.imgur.com/CfMnW1h.jpeg"
    >
      <p>This is some custom content rendered between the intro and the list.</p>
    </Article>
  );
}