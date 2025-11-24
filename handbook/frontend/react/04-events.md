
# Блок 4 — События (Events)

Цель
---
Научиться обрабатывать пользовательские события в React, работать с формами и понимать разницу между controlled и uncontrolled компонентами.

Темы
---
- Синтетические события (`SyntheticEvent`) — обёртка React вокруг нативных событий.
- Обработчики событий: `onClick`, `onChange`, `onSubmit`.
- Передача аргументов в обработчики: `onClick={() => handle(id)}` или `onClick={e => handle(e, id)}`.
- `preventDefault()` для предотвращения стандартного поведения форм.
- Controlled components: значение input хранится в state.
- Uncontrolled components: доступ к DOM через `ref`.

Пример (submit формы):

```jsx
function Search() {
	const [q, setQ] = React.useState('');
	const onSubmit = (e) => {
		e.preventDefault();
		console.log('search', q);
	};
	return (
		<form onSubmit={onSubmit}>
			<input value={q} onChange={e => setQ(e.target.value)} />
			<button type="submit">Search</button>
		</form>
	);
}
```

Практика: `04-events-practice.md`.
