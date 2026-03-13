import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import { adminService } from '../services/api';

export default function Administradores() {
  const [showModal, setShowModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    rol: 'admin',
    estado: 'activo'
  });

  const queryClient = useQueryClient();

  const { data: adminsData, isLoading } = useQuery({
    queryKey: ['administradores'],
    queryFn: () => adminService.getAll().then(res => res.data)
  });

  const createMutation = useMutation({
    mutationFn: (data) => adminService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['administradores']);
      toast.success('Administrador creado exitosamente');
      closeModal();
    },
    onError: () => toast.error('Error al crear administrador')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => adminService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['administradores']);
      toast.success('Administrador actualizado');
      closeModal();
    },
    onError: () => toast.error('Error al actualizar administrador')
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['administradores']);
      toast.success('Administrador eliminado');
    },
    onError: () => toast.error('Error al eliminar administrador')
  });

  const openModal = (admin = null) => {
    if (admin) {
      setSelectedAdmin(admin);
      setFormData({
        nombre: admin.nombre,
        apellido: admin.apellido,
        email: admin.email,
        rol: admin.rol,
        estado: admin.estado
      });
    } else {
      setSelectedAdmin(null);
      setFormData({
        nombre: '',
        apellido: '',
        email: '',
        rol: 'admin',
        estado: 'activo'
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAdmin(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedAdmin) {
      updateMutation.mutate({ id: selectedAdmin.id_admin, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const admins = adminsData?.data?.data || [];

  if (isLoading) return <div className="page-container"><p>Cargando...</p></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Administradores</h1>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <FiPlus /> Nuevo Administrador
        </button>
      </div>

      <div className="stats-grid mb-4">
        <div className="stat-card">
          <div className="stat-info">
            <h3>{admins.length}</h3>
            <p>Total Administradores</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <h3>{admins.filter(a => a.estado === 'activo').length}</h3>
            <p>Activos</p>
          </div>
        </div>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id_admin}>
                <td>{admin.nombre} {admin.apellido}</td>
                <td>{admin.email}</td>
                <td>
                  <span className="badge badge-info">{admin.rol}</span>
                </td>
                <td>
                  <span className={`badge ${admin.estado === 'activo' ? 'badge-success' : 'badge-danger'}`}>
                    {admin.estado}
                  </span>
                </td>
                <td>
                  <button className="btn-icon text-warning" onClick={() => openModal(admin)}>
                    <FiEdit2 />
                  </button>
                  <button className="btn-icon text-danger" onClick={() => deleteMutation.mutate(admin.id_admin)}>
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{selectedAdmin ? 'Editar Administrador' : 'Nuevo Administrador'}</h2>
              <button className="btn-icon" onClick={closeModal}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Nombre *</label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Apellido *</label>
                  <input
                    type="text"
                    value={formData.apellido}
                    onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Rol</label>
                  <select
                    value={formData.rol}
                    onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                  >
                    <option value="admin">Administrador</option>
                    <option value="dueno">Dueño</option>
                    <option value="recepcionista">Recepcionista</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Estado</label>
                  <select
                    value={formData.estado}
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {selectedAdmin ? 'Actualizar' : 'Crear'} Administrador
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
