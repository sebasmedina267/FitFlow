
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/dashboard';
import Clients from './pages/clients';
import Payments from './pages/payments';
import Admins from './pages/admins';
import Login from './pages/login';
import Register from './pages/register';

function App() {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <main>
          <Header />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/admins" element={<Admins />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
