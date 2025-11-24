
# Практика — Блок 4: Events

Задачи:
- Кнопки с разными обработчиками (onClick с аргументами).
- Форма регистрации с client-side валидацией (`preventDefault`).
- Controlled inputs: показать и сохранить значение в state.
- Калькулятор (микро-проект) — базовые операции (прибавление/вычитание).

Пример: передача аргумента в handler

```jsx
function Item({ id, onRemove }) {
	return <button onClick={() => onRemove(id)}>Remove</button>;
}
```
