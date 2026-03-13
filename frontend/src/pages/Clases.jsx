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
    precio: '',
    tipo_pago: 'Mensual',
    horarios: [],
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
        precio: clase.precio,
        tipo_pago: clase.tipo_pago,
        horarios: clase.horarios ? clase.horarios.split(', ') : [],
      });
    } else {
      setSelectedClase(null);
      setFormData({
        nombre: '',
        descripcion: '',
        precio: '',
        tipo_pago: 'Mensual',
        horarios: [],
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
  
  const handleHorarioChange = (index, value) => {
    const newHorarios = [...formData.horarios];
    newHorarios[index] = value;
    setFormData({ ...formData, horarios: newHorarios });
  };

  const addHorario = () => {
    setFormData({ ...formData, horarios: [...formData.horarios, ''] });
  };

  const removeHorario = (index) => {
    const newHorarios = formData.horarios.filter((_, i) => i !== index);
    setFormData({ ...formData, horarios: newHorarios });
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
              <th>Descripción</th>
              <th>Precio</th>
              <th>Tipo de Pago</th>
              <th>Horarios</th>
              <th>Clientes</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clases.map((clase) => (
              <tr key={clase.id_clase}>
                <td>{clase.nombre}</td>
                <td>{clase.descripcion}</td>
                <td>{clase.precio}</td>
                <td>{clase.tipo_pago}</td>
                <td>{clase.horarios}</td>
                <td>{clase.num_clientes}</td>
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
                  <label>Precio *</label>
                  <input
                    type="number"
                    value={formData.precio}
                    onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Tipo de Pago</label>
                  <select
                    value={formData.tipo_pago}
                    onChange={(e) => setFormData({ ...formData, tipo_pago: e.target.value })}
                  >
                    <option value="Mensual">Mensual</option>
                    <option value="Único">Único</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Horarios</label>
                {formData.horarios.map((horario, index) => (
                  <div key={index} className="input-group">
                    <input
                      type="text"
                      value={horario}
                      onChange={(e) => handleHorarioChange(index, e.target.value)}
                      placeholder="Ej: Lunes 10:00"
                    />
                    <button type="button" className="btn-icon text-danger" onClick={() => removeHorario(index)}>
                      <FiX />
                    </button>
                  </div>
                ))}
                <button type="button" className="btn btn-sm btn-secondary" onClick={addHorario}>
                  Agregar Horario
                </button>
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
