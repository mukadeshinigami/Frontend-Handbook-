# Блок 8 — Работа с формами

Цель
---
Научиться создавать формы (controlled и uncontrolled), валидировать ввод и отправлять данные на сервер.

Ключевые темы
---
- Controlled components: значение и поведение input управляется через React state.
- Uncontrolled components: доступ к значению через `ref`.
- Обработка разных типов полей: text, checkbox, radio, select, file.
- Валидация: синхронная и асинхронная, сообщения об ошибках.
- Библиотеки: краткий обзор React Hook Form и Formik — почему и когда их использовать.

Пример — controlled форма
---

```jsx
import React, { useState } from 'react';

function Signup() {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [errors, setErrors] = useState({});

	const validate = () => {
		const e = {};
		if (!name) e.name = 'Name is required';
		if (!email.includes('@')) e.email = 'Invalid email';
		setErrors(e);
		return Object.keys(e).length === 0;
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!validate()) return;
		// отправка на сервер (fetch/axios)
		console.log({ name, email });
	};

	return (
		<form onSubmit={handleSubmit} noValidate>
			<div>
				<input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
				{errors.name && <div className="error">{errors.name}</div>}
			</div>
			<div>
				<input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
				{errors.email && <div className="error">{errors.email}</div>}
			</div>
			<button type="submit">Register</button>
		</form>
	);
}
```

Uncontrolled example (файл):

```jsx
import React, { useRef } from 'react';

function FileUpload() {
	const ref = useRef();
	const onSubmit = e => {
		e.preventDefault();
		const files = ref.current.files;
		// preview / upload
		console.log(files);
	};
	return (
		<form onSubmit={onSubmit}>
			<input type="file" ref={ref} />
			<button type="submit">Upload</button>
		</form>
	);
}
```

Практика: `08-forms-practice.md`.
