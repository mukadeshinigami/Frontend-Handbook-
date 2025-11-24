
# Блок 1 — Основы React и первый компонент

Цель
---
Понять, что такое React, как устроен Virtual DOM, создать простое приложение и написать первые компоненты на JSX.

Ключевые идеи
---
- React — библиотека для построения UI от Facebook/Meta. Фокус на декларативном подходе и компонентах.
- Virtual DOM — лёгкий in-memory representation DOM, который React использует для минимальных обновлений реального DOM.
- Компоненты — базовые строительные блоки интерфейса. Современный фокус — функциональные компоненты + Hooks.

Установка ( кратко )
---
Рекомендуемые варианты: Vite (быстрее для разработки) или Create React App (удобно для начинающих).

Создание проекта (Vite):

```bash
npm create vite@latest my-app -- --template react
cd my-app
npm install
npm run dev
```

Или Create React App:

```bash
npx create-react-app my-app
cd my-app
npm start
```

Минимальный пример компонента (JSX)
---

```jsx
// src/App.jsx
import React from 'react';

function ProductCard({ title, price }) {
	return (
		<div className="product-card">
			<h3>{title}</h3>
			<p>Price: ${price}</p>
		</div>
	);
}

export default function App() {
	return (
		<main>
			<h1>Hello, React!</h1>
			<ProductCard title="Notebook" price={999} />
		</main>
	);
}
```

Разбор
---
- `ProductCard` — функциональный компонент, принимает `props` и возвращает JSX.
- JSX выглядит как HTML, но это синтаксический сахар для `React.createElement`.
- Обратите внимание на `className` вместо `class`.

Инструменты разработчика
---
- Установите расширение React Developer Tools в браузер — удобно смотреть дерево компонентов и state.

Дальше
---
Практические задания — в `01-basics-practice.md`.
