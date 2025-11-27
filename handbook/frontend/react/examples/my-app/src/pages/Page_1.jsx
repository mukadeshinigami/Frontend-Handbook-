import React, { useState } from 'react';
import Article from '../components/Article.jsx';
import './Page_1.css';

function Button({children, variant, ...props}) {
	const className = variant === 'special_del' ? '' : 'special';
	return (
		<button className= {className} {...props}>
			{children}
		</button>
	);
}
function Todos() {
	const [text, setText] = useState('');
	const [items, setItems] = useState([]);

	function addTodo(e) {
		e.preventDefault();

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

			<Button onClick={addTodo}>Добавить</Button>
			<ul>
				{items.map(t => (
					<li key={t.id}>
						{t.text} <Button className = 'special_del' onClick={() => removeTodo(t.id)}>Удалить</Button>
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