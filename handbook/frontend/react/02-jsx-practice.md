
# Практика — Блок 2: JSX

Задачи:
- Сделайте компонент, который условно отображает блок (show/hide) через `&&`.
- Создайте компонент со стилями через `style` и через CSS-класс.
- Реализуйте список элементов с условным отображением элементов по флагу.

Пример (show/hide):

```jsx
import React, { useState } from 'react';

function Toggle() {
	const [visible, setVisible] = useState(true);
	return (
		<div>
			<button onClick={() => setVisible(v => !v)}>Toggle</button>
			{visible && <p>This text is visible</p>}
		</div>
	);
}
```

Подсказки:
- Помните про `key` при рендеринге списков.

