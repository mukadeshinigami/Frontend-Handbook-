# Практика — Блок 3: useState

Задачи:
- Счётчик (Counter) с увеличением/уменьшением и reset.
- Toggle button (show/hide компонент).
- Форма с controlled inputs (имя, email) и валидацией.
- Todo List: добавление и удаление задач (используя массив в state).

Пример: простая форма (controlled input):

```jsx
import React, { useState } from 'react';

function Signup() {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();
		alert(`Name: ${name}, Email: ${email}`);
	};

	return (
		<form onSubmit={handleSubmit}>
			<input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
			<input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
			<button type="submit">Submit</button>
		</form>
	);
}
```
