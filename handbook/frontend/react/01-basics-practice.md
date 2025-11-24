# Практика — Блок 1: Hello World и простые компоненты

Цель
---
Создать рабочее React-приложение и реализовать простые компоненты, проверить понимание props и рендеринга списка.

Задачи:
- Создайте приложение с помощью Create React App или Vite и запустите dev-сервер.
- Реализуйте компонент `ProductCard` с props: `title`, `price`, `image`.
- Создайте список продуктов и отрисуйте его через `.map()`.
- Добавьте компонент `Hello` который принимает `name` в props и отображает приветствие.

Подсказки и команды:
- `npx create-react-app my-app` или `npm create vite@latest my-app -- --template react`
- `cd my-app && npm install && npm run dev`

Пошаговая инструкция (пример)
---
1. Создайте проект (Vite):

```bash
npm create vite@latest my-app -- --template react
cd my-app
npm install
npm run dev
```

2. Откройте `src/App.jsx` и замените содержимое на пример ниже:

```jsx
import React from 'react';

function ProductCard({ title, price }) {
	return (
		<div>
			<h3>{title}</h3>
			<p>${price}</p>
		</div>
	);
}

export default function App() {
	const products = [
		{ id: 1, title: 'Notebook', price: 999 },
		{ id: 2, title: 'Phone', price: 699 }
	];

	return (
		<div>
			<h1>Products</h1>
			{products.map(p => (
				<ProductCard key={p.id} title={p.title} price={p.price} />
			))}
		</div>
	);
}
```

3. Проверьте приложение в браузере и откройте React DevTools для инспекции компонентов.

Критерии выполнения
---
- Dev-сервер запускается без ошибок.
- На странице отображается список карточек продуктов.
- В консоли/React DevTools видно, что `ProductCard` получает ожидаемые props.

