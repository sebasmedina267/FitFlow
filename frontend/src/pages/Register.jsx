import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiLock, FiActivity } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { Button, Input } from '../components/ui';
import { authService } from '../services/api';

export default function Register() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    rol: 'empleado',
    password: '',
    confirmPassword: ''
  });
  const [existsDueno, setExistsDueno] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validatePassword = (password) => {
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return hasMinLength && hasUppercase && hasNumber && hasSymbol;
  };

  // Check if dueño exists on mount
  useEffect(() => {
    const checkDueno = async () => {
      try {
        const response = await authService.checkDueno();
        setExistsDueno(response.data.data.existeDueno);
      } catch (error) {
        console.error('Error checking dueño status:', error);
      }
    };
    checkDueno();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (!validatePassword(formData.password)) {
      toast.error('La contraseña debe tener mínimo 8 caracteres, una mayúscula, un número y un símbolo');
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword: _, ...dataToSend } = formData;
      await authService.register(dataToSend);
      toast.success('Cuenta creada exitosamente');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al crear cuenta');
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
          <h1 className="auth-title">Crear Cuenta</h1>
          <p className="auth-subtitle">Regístrate como administrador del gimnasio</p>

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
                required
              />
            </div>

            {!existsDueno && (
              <div className="form-group">
                <label className="form-label">¿Registrarse como?</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="rol"
                      value="dueno"
                      checked={formData.rol === 'dueno'}
                      onChange={handleChange}
                    />
                    Dueño (Administrador Principal)
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="rol"
                      value="empleado"
                      checked={formData.rol === 'empleado'}
                      onChange={handleChange}
                    />
                    Empleado
                  </label>
                </div>
              </div>
            )}

            <Input
              label="Contraseña"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              icon={FiLock}
              helper="Mín. 8 caracteres, 1 mayúscula, 1 número, 1 símbolo"
              required
            />

            <Input
              label="Confirmar Contraseña"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
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
              Crear Cuenta
            </Button>
          </form>

          <div className="auth-footer">
            <p>
              ¿Ya tienes cuenta?{' '}
              <Link to="/login">Iniciar sesión</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
