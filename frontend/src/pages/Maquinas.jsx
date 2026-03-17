import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import { maquinaService } from '../services/api';

const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001';

export default function Maquinas() {
  const [showModal, setShowModal] = useState(false);
  const [selectedMaquina, setSelectedMaquina] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    foto: null
  });
  const fileInputRef = useRef(null);

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
        descripcion: maquina.descripcion || '',
        foto: null
      });
    } else {
      setSelectedMaquina(null);
      setFormData({
        nombre: '',
        descripcion: '',
        foto: null
      });
    }
    if (fileInputRef.current) {
        fileInputRef.current.value = null;
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedMaquina(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('nombre', formData.nombre);
    data.append('descripcion', formData.descripcion);
    if (formData.foto) {
      data.append('foto', formData.foto);
    }

    if (selectedMaquina) {
      updateMutation.mutate({ id: selectedMaquina.id_maquina, data });
    } else {
      createMutation.mutate(data);
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
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Foto</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {maquinas.map((maquina) => (
              <tr key={maquina.id_maquina}>
                <td>
                  {maquina.foto && 
                    <img src={`${API_URL}/uploads/${maquina.foto}`} alt={maquina.nombre} className="table-img" />
                  }
                </td>
                <td>{maquina.nombre}</td>
                <td>{maquina.descripcion}</td>
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
            <form onSubmit={handleSubmit} encType="multipart/form-data">
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
              <div className="form-group">
                <label>Foto</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => setFormData({ ...formData, foto: e.target.files[0] })}
                />
              </div>
              {selectedMaquina?.foto && 
                <div className="form-group">
                    <p>Foto actual:</p>
                    <img src={`${API_URL}/uploads/${selectedMaquina.foto}`} alt={selectedMaquina.nombre} className="form-preview-img"/>
                </div>
              }
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
