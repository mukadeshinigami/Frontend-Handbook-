# Блок 7 — useEffect Hook — Side Effects

Цель
---
Понять, что такое побочные эффекты (side effects) и как управлять ими с помощью хука `useEffect`.

Ключевые идеи
---
- Side effects — операции вне рендера: запросы к API, таймеры, подписки на события, манипуляции с DOM.
- `useEffect(effect, deps)` выполняет `effect` после рендера; `deps` — массив зависимостей.
- Пустой массив `[]` — эффект выполняется при mount и cleanup при unmount.
- Возвращаемая функция внутри эффекта — это cleanup, вызывается при размонтировании или перед повторным вызовом эффекта.

Пример: таймер и fetch
---

```jsx
import React, { useState, useEffect } from 'react';

function Clock() {
	const [time, setTime] = useState(() => new Date().toLocaleTimeString());

	useEffect(() => {
		const id = setInterval(() => {
			setTime(new Date().toLocaleTimeString());
		}, 1000);
		return () => clearInterval(id);
	}, []);

	return <div>{time}</div>;
}

function UsersList() {
	const [users, setUsers] = useState([]);
	useEffect(() => {
		let mounted = true;
		fetch('https://jsonplaceholder.typicode.com/users')
			.then(r => r.json())
			.then(data => { if (mounted) setUsers(data); });
		return () => { mounted = false; };
	}, []);

	return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}
```

Советы
---
- Указывайте все зависимости, используемые в эффекте, чтобы избежать stale closures.
- Для отмены асинхронных операций используйте AbortController или флаг `mounted`.

Практика: `07-useeffect-practice.md`.
