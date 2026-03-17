import axios from 'axios';

// Use environment variables or fall back to defaults
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('admin');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  recoverPassword: (data) => api.post('/auth/recover-password', data),
  checkDueno: () => api.get('/auth/check-dueno'),
  getProfile: () => api.get('/auth/profile')
};

// Clientes
export const clienteService = {
  getAll: () => api.get('/clientes'),
  getById: (id) => api.get(`/clientes/${id}`),
  create: (data) => api.post('/clientes', data),
  update: (id, data) => api.put(`/clientes/${id}`, data),
  delete: (id) => api.delete(`/clientes/${id}`),
  getEstadisticas: () => api.get('/clientes/estadisticas')
};

// Clases
export const claseService = {
  getAll: () => api.get('/clases'),
  getById: (id) => api.get(`/clases/${id}`),
  create: (data) => api.post('/clases', data),
  update: (id, data) => api.put(`/clases/${id}`, data),
  delete: (id) => api.delete(`/clases/${id}`),
  getEstadisticas: () => api.get('/clases/estadisticas')
};

// Máquinas
export const maquinaService = {
  getAll: () => api.get('/maquinas'),
  getById: (id) => api.get(`/maquinas/${id}`),
  create: (data) => api.post('/maquinas', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/maquinas/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/maquinas/${id}`)
};

// Productos
export const productoService = {
  getAll: () => api.get('/productos'),
  getById: (id) => api.get(`/productos/${id}`),
  create: (data) => api.post('/productos', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/productos/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/productos/${id}`),
  compra: (data) => api.post('/productos/compra', data),
  venta: (data) => api.post('/productos/venta', data),
  getCompras: (params) => api.get('/productos/compras', { params }),
  getVentas: (params) => api.get('/productos/ventas', { params }),
  getEstadisticas: () => api.get('/productos/estadisticas')
};

// Pagos
export const pagoService = {
  getAll: (params) => api.get('/pagos', { params }),
  getByClase: (id) => api.get(`/pagos/clase/${id}`),
  create: (data) => api.post('/pagos', data),
  marcarPagado: (id, data) => api.post(`/pagos/${id}/pagar`, data),
  marcarNoPagado: (id) => api.post(`/pagos/${id}/desmarcar`),
  getEstadisticas: () => api.get('/pagos/estadisticas')
};

// Economía
export const economiaService = {
  getBalance: (params) => api.get('/economia/balance', { params }),
  getEstadisticas: (params) => api.get('/economia/estadisticas', { params }),
  exportarPDF: (params) => api.get('/economia/exportar-pdf', { params, responseType: 'blob' }),
  getIngresos: (params) => api.get('/economia/ingresos', { params }),
  createIngreso: (data) => api.post('/economia/ingresos', data),
  getGastos: (params) => api.get('/economia/gastos', { params }),
  createGasto: (data) => api.post('/economia/gastos', data)
};

// Administradores
export const adminService = {
  getAll: () => api.get('/admins'),
  getById: (id) => api.get(`/admins/${id}`),
  update: (id, data) => api.put(`/admins/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/admins/${id}`),
  getAuditoria: (params) => api.get('/admins/auditoria', { params })
};

// Alias for backward compatibility
export const authAPI = authService;

export default api;
