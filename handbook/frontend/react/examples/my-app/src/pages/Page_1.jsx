import React, { useState } from 'react';
import Article from '../components/Article.jsx';
import './Page_1.css';

function Todos() {
	const [text, setText] = useState('');
	const [items, setItems] = useState([]);

	function addTodo() {
		if (!text.trim()) return;

		setItems(prev => [...prev, { 
			id: Date.now(), 
			text: text.trim() }]);

		setText('');
	}

	function removeTodo(id) {
		setItems(prev => prev.filter(t => t.id !== id));
	}

	return (
		<div>
			<h3>Список задач</h3>
			<input value={text} onChange={e => setText(e.target.value)} />
			<button onClick={addTodo}>Добавить</button>
			<ul>
				{items.map(t => (
					<li key={t.id}>
						{t.text} <button onClick={() => removeTodo(t.id)}>Удалить</button>
					</li>
				))}
			</ul>
		</div>
	);
}


export default function Page_1() {
	return (
		<div className="page-1">
			<Article title="Пример: Todos" intro="Простой пример списка задач">
				<Todos />
			</Article>
		</div>
	);
}