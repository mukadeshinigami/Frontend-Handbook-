import React, { useState } from 'react';
import './Page_1.css';



function FilterableList({ items }) {
	const [q, setQ] = React.useState('');
	const filtered = items.filter(i => 
        i.name.toLowerCase().includes(q.toLowerCase()) ||
        i.age.toString().includes(q)
    );
    
	return (
		<div>
			<input value={q} onChange={e => setQ(e.target.value)} placeholder="Search" />
			<ul>
				{filtered.map(item => <li key={item.id}>{item.name} {item.age}</li>)} 
			</ul>
		</div>
        );
    }

export default function Page_2() {
    const users = [
        { id: 1, name: 'Alice', age: 25 },
        { id: 2, name: 'Bob', age: 30 },
        { id: 3, name: 'Charlie', age: 35 },
    ];

    return (
        <div className="page-2">
            <h3>Список пользователей</h3>
            <FilterableList items={users} />
        </div>
    );
}