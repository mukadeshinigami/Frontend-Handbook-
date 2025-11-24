import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import Register from './pages/Register';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Profile from './pages/Profile';
import Page_1 from './pages/Page_1';

function Item({ name, isPacked }) {
  return (
    <p>
      {isPacked ? '✅' : '❌'} {name}
    </p>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <header>
        <nav>
          <Link to="/"><Item name="Home" isPacked={true} /></Link> 
          
          <Link to="/catalog"><Item name="Catalog" isPacked={false} /></Link>{' '}

          <Link to="/register"><Item name="Register" isPacked={true} /></Link>{' '} 
          <Link to="/profile"><Item name="Profile" isPacked={true} /></Link>{' '}

          <Link to="/Page_1"><Item name="Page 1" isPacked={true} /></Link>

        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/Page_1" element={<Page_1 />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}