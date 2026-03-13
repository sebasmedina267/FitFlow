import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Clases from './pages/Clases';
import Maquinas from './pages/Maquinas';
import Productos from './pages/Productos';
import Pagos from './pages/Pagos';
import Economia from './pages/Economia';
import Administradores from './pages/Administradores';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout><Navigate to="/dashboard" replace /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout><Dashboard /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/clientes" element={
            <ProtectedRoute>
              <Layout><Clientes /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/clases" element={
            <ProtectedRoute>
              <Layout><Clases /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/maquinas" element={
            <ProtectedRoute>
              <Layout><Maquinas /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/productos" element={
            <ProtectedRoute>
              <Layout><Productos /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/pagos" element={
            <ProtectedRoute>
              <Layout><Pagos /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/economia" element={
            <ProtectedRoute>
              <Layout><Economia /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/administradores" element={
            <ProtectedRoute>
              <Layout><Administradores /></Layout>
            </ProtectedRoute>
          } />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
