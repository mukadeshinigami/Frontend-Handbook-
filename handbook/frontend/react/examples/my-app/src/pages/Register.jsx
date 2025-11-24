import React, { useState } from 'react';

export default function Register() {
  const [form, setForm] = useState({ email: '', password: '' });

  function submit(e) {
    e.preventDefault();
    console.log('register', form);
  }

  return (
    <section>
      <h1>Register</h1>
      <form onSubmit={submit}>
        <input
          placeholder="Email"
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
        />
        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
        />
        <button type="submit">Register</button>
      </form>
    </section>
  );
}