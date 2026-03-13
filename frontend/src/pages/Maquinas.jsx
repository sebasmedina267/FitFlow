import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import { maquinaService } from '../services/api';

export default function Maquinas() {
  const [showModal, setShowModal] = useState(false);
  const [selectedMaquina, setSelectedMaquina] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    serie: '',
    ubicacion: '',
    estado: 'activa',
    ultima_mantencion: ''
  });

  const queryClient = useQueryClient();

  const { data: maquinasData, isLoading } = useQuery({
    queryKey: ['maquinas'],
    queryFn: () => maquinaService.getAll().then(res => res.data)
  });

  const createMutation = useMutation({
    mutationFn: (data) => maquinaService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['maquinas']);
      toast.success('Máquina creada exitosamente');
      closeModal();
    },
    onError: () => toast.error('Error al crear máquina')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => maquinaService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['maquinas']);
      toast.success('Máquina actualizada');
      closeModal();
    },
    onError: () => toast.error('Error al actualizar máquina')
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => maquinaService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['maquinas']);
      toast.success('Máquina eliminada');
    },
    onError: () => toast.error('Error al eliminar máquina')
  });

  const openModal = (maquina = null) => {
    if (maquina) {
      setSelectedMaquina(maquina);
      setFormData({
        nombre: maquina.nombre,
        serie: maquina.serie,
        ubicacion: maquina.ubicacion,
        estado: maquina.estado,
        ultima_mantencion: maquina.ultima_mantencion
      });
    } else {
      setSelectedMaquina(null);
      setFormData({
        nombre: '',
        serie: '',
        ubicacion: '',
        estado: 'activa',
        ultima_mantencion: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedMaquina(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedMaquina) {
      updateMutation.mutate({ id: selectedMaquina.id_maquina, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const maquinas = maquinasData?.data?.data || [];

  if (isLoading) return <div className="page-container"><p>Cargando...</p></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Máquinas</h1>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <FiPlus /> Nueva Máquina
        </button>
      </div>

      <div className="stats-grid mb-4">
        <div className="stat-card">
          <div className="stat-info">
            <h3>{maquinas.length}</h3>
            <p>Total Máquinas</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <h3>{maquinas.filter(m => m.estado === 'activa').length}</h3>
            <p>Activas</p>
          </div>
        </div>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Número de Serie</th>
              <th>Ubicación</th>
              <th>Estado</th>
              <th>Última Mantención</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {maquinas.map((maquina) => (
              <tr key={maquina.id_maquina}>
                <td>{maquina.nombre}</td>
                <td>{maquina.serie}</td>
                <td>{maquina.ubicacion}</td>
                <td>
                  <span className={`badge ${maquina.estado === 'activa' ? 'badge-success' : 'badge-danger'}`}>
                    {maquina.estado}
                  </span>
                </td>
                <td>{maquina.ultima_mantencion}</td>
                <td>
                  <button className="btn-icon text-warning" onClick={() => openModal(maquina)}>
                    <FiEdit2 />
                  </button>
                  <button className="btn-icon text-danger" onClick={() => deleteMutation.mutate(maquina.id_maquina)}>
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
              <h2>{selectedMaquina ? 'Editar Máquina' : 'Nueva Máquina'}</h2>
              <button className="btn-icon" onClick={closeModal}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit}>
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
                <label>Número de Serie</label>
                <input
                  type="text"
                  value={formData.serie}
                  onChange={(e) => setFormData({ ...formData, serie: e.target.value })}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Ubicación</label>
                  <input
                    type="text"
                    value={formData.ubicacion}
                    onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Estado</label>
                  <select
                    value={formData.estado}
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                  >
                    <option value="activa">Activa</option>
                    <option value="inactiva">Inactiva</option>
                    <option value="mantencion">En Mantención</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Última Mantención</label>
                <input
                  type="date"
                  value={formData.ultima_mantencion}
                  onChange={(e) => setFormData({ ...formData, ultima_mantencion: e.target.value })}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {selectedMaquina ? 'Actualizar' : 'Crear'} Máquina
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
