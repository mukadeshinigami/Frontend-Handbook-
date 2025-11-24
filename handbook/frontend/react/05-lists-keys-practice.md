
# Практика — Блок 5: Lists & Keys

Задачи:
- Список пользователей, отрисованный через `.map()`.
- Фильтруемый список (поиск по имени).
- Сортируемая таблица с колонками.
- Todo List с фильтрами (all/active/completed).

Пример: фильтруемый список

```jsx
function FilterableList({ items }) {
	const [q, setQ] = React.useState('');
	const filtered = items.filter(i => i.name.toLowerCase().includes(q.toLowerCase()));
	return (
		<div>
			<input value={q} onChange={e => setQ(e.target.value)} placeholder="Search" />
			<ul>
				{filtered.map(it => <li key={it.id}>{it.name}</li>)}
			</ul>
		</div>
	);
}
```
