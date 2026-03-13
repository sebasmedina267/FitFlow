import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import { claseService } from '../services/api';

export default function Clases() {
  const [showModal, setShowModal] = useState(false);
  const [selectedClase, setSelectedClase] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    instructor: '',
    horario: '',
    capacidad: '',
    duracion: ''
  });

  const queryClient = useQueryClient();

  const { data: clasesData, isLoading } = useQuery({
    queryKey: ['clases'],
    queryFn: () => claseService.getAll().then(res => res.data)
  });

  const createMutation = useMutation({
    mutationFn: (data) => claseService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['clases']);
      toast.success('Clase creada exitosamente');
      closeModal();
    },
    onError: () => toast.error('Error al crear clase')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => claseService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['clases']);
      toast.success('Clase actualizada');
      closeModal();
    },
    onError: () => toast.error('Error al actualizar clase')
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => claseService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['clases']);
      toast.success('Clase eliminada');
    },
    onError: () => toast.error('Error al eliminar clase')
  });

  const openModal = (clase = null) => {
    if (clase) {
      setSelectedClase(clase);
      setFormData({
        nombre: clase.nombre,
        descripcion: clase.descripcion,
        instructor: clase.instructor,
        horario: clase.horario,
        capacidad: clase.capacidad,
        duracion: clase.duracion
      });
    } else {
      setSelectedClase(null);
      setFormData({
        nombre: '',
        descripcion: '',
        instructor: '',
        horario: '',
        capacidad: '',
        duracion: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedClase(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedClase) {
      updateMutation.mutate({ id: selectedClase.id_clase, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const clases = clasesData?.data?.data || [];

  if (isLoading) return <div className="page-container"><p>Cargando...</p></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Clases</h1>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <FiPlus /> Nueva Clase
        </button>
      </div>

      <div className="stats-grid mb-4">
        <div className="stat-card">
          <div className="stat-info">
            <h3>{clases.length}</h3>
            <p>Total Clases</p>
          </div>
        </div>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Instructor</th>
              <th>Horario</th>
              <th>Capacidad</th>
              <th>Duración</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clases.map((clase) => (
              <tr key={clase.id_clase}>
                <td>{clase.nombre}</td>
                <td>{clase.instructor}</td>
                <td>{clase.horario}</td>
                <td>{clase.capacidad}</td>
                <td>{clase.duracion} min</td>
                <td>
                  <button className="btn-icon text-warning" onClick={() => openModal(clase)}>
                    <FiEdit2 />
                  </button>
                  <button className="btn-icon text-danger" onClick={() => deleteMutation.mutate(clase.id_clase)}>
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
              <h2>{selectedClase ? 'Editar Clase' : 'Nueva Clase'}</h2>
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
                <label>Descripción</label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Instructor *</label>
                  <input
                    type="text"
                    value={formData.instructor}
                    onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Horario *</label>
                  <input
                    type="time"
                    value={formData.horario}
                    onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Capacidad</label>
                  <input
                    type="number"
                    value={formData.capacidad}
                    onChange={(e) => setFormData({ ...formData, capacidad: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Duración (minutos)</label>
                  <input
                    type="number"
                    value={formData.duracion}
                    onChange={(e) => setFormData({ ...formData, duracion: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {selectedClase ? 'Actualizar' : 'Crear'} Clase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
