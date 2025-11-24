# Практика — Блок 7: useEffect

Задачи:
- Fetch данных с публичного API и отображение списка.
- Таймер / Clock компонент.
- Подписка на события (resize) и отписка в cleanup.
- Debounce для поискового поля.

Подсказки и примеры
---

1) Fetch данных

```jsx
import React, { useState, useEffect } from 'react';

function Posts() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    let mounted = true;
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then(r => r.json())
      .then(data => { if (mounted) setPosts(data.slice(0, 10)); });
    return () => { mounted = false; };
  }, []);
  return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>;
}
```

2) Таймер / Clock

```jsx
import React, { useState, useEffect } from 'react';

function Clock() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(id);
  }, []);
  return <div>{time}</div>;
}
```

3) Подписка на события (resize)

```jsx
useEffect(() => {
  const onResize = () => setWidth(window.innerWidth);
  window.addEventListener('resize', onResize);
  return () => window.removeEventListener('resize', onResize);
}, []);
```

4) Debounce для поискового поля

```jsx
useEffect(() => {
  const id = setTimeout(() => doSearch(q), 300);
  return () => clearTimeout(id);
}, [q]);
```

Критерии выполнения
---
- Fetch: список постов отображается, при размонтировании запросы не приводят к setState.
- Clock: время обновляется каждую секунду, при переходе с компонента таймер очищается.
- Debounce: запросы выполняются после паузы, а не на каждое изменение.
