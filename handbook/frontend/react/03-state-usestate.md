
# Блок 3 — State и useState

Цель
---
Понять концепцию состояния в React и научиться управлять локальным состоянием компонентов с помощью `useState`.

Темы (развернуто)
---
- `state` — данные, которые изменяются со временем и влияют на UI.
- `useState(initial)` возвращает пару `[value, setValue]`.
- Обновление state должно быть иммутабельным — не мутируйте объекты напрямую.
- Можно использовать несколько вызовов `useState` для разных частей состояния.
- Для обновлений, зависящих от предыдущего значения, используйте функциональную форму: `setValue(prev => prev + 1)`.

Пример — счётчик:

```jsx
import React, { useState } from 'react';

function Counter() {
	const [count, setCount] = useState(0);
	return (
		<div>
			<p>Count: {count}</p>
			<button onClick={() => setCount(c => c + 1)}>+1</button>
			<button onClick={() => setCount(0)}>Reset</button>
		</div>
	);
}
```

Практика в `03-state-usestate-practice.md`.
