import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiLock, FiActivity } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { Button, Input } from '../components/ui';
import useAuthStore from '../store/authStore';

export default function Login() {
  const [formData, setFormData] = useState({ nombre: '', apellidos: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loginAsync } = useAuthStore();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await loginAsync(formData);
      if (result.success) {
        toast.success('¡Bienvenido de nuevo!');
        navigate('/dashboard');
      } else {
        toast.error(result.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-brand">
          <FiActivity className="auth-brand-icon" />
          <span className="auth-brand-text">FitFlow</span>
        </div>

        <div className="auth-card">
          <h1 className="auth-title">Iniciar Sesión</h1>
          <p className="auth-subtitle">Accede a tu panel de administración</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <Input
                label="Nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Juan"
                icon={FiUser}
                required
              />
              <Input
                label="Apellidos"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                placeholder="Pérez García"
                icon={FiUser}
                required
              />
            </div>

            <Input
              label="Contraseña"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              icon={FiLock}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
            >
              Iniciar Sesión
            </Button>
          </form>

          <div className="auth-footer">
            <p>
              ¿No tienes cuenta?{' '}
              <Link to="/register">Crear cuenta</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
