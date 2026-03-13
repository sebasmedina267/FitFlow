import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import { clienteService } from '../services/api';

export default function Clientes() {
  const [showModal, setShowModal] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    edad: '',
    sexo: 'Hombre',
  });

  const queryClient = useQueryClient();

  const { data: clientesData, isLoading } = useQuery({
    queryKey: ['clientes'],
    queryFn: () => clienteService.getAll().then(res => res.data)
  });

  const createMutation = useMutation({
    mutationFn: (data) => clienteService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['clientes']);
      toast.success('Cliente creado exitosamente');
      closeModal();
    },
    onError: () => toast.error('Error al crear cliente')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => clienteService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['clientes']);
      toast.success('Cliente actualizado');
      closeModal();
    },
    onError: () => toast.error('Error al actualizar cliente')
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => clienteService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['clientes']);
      toast.success('Cliente eliminado');
    },
    onError: () => toast.error('Error al eliminar cliente')
  });

  const openModal = (cliente = null) => {
    if (cliente) {
      setSelectedCliente(cliente);
      setFormData({
        nombre: cliente.nombre,
        edad: cliente.edad,
        sexo: cliente.sexo
      });
    } else {
      setSelectedCliente(null);
      setFormData({
        nombre: '',
        edad: '',
        sexo: 'Hombre'
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCliente(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedCliente) {
      updateMutation.mutate({ id: selectedCliente.id_cliente, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const clientes = clientesData?.data?.data || [];

  if (isLoading) return <div className="page-container"><p>Cargando...</p></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Clientes</h1>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <FiPlus /> Nuevo Cliente
        </button>
      </div>

      <div className="stats-grid mb-4">
        <div className="stat-card">
          <div className="stat-info">
            <h3>{clientes.length}</h3>
            <p>Total Clientes</p>
          </div>
        </div>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Edad</th>
              <th>Sexo</th>
              <th>Clases</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id_cliente}>
                <td>{cliente.nombre}</td>
                <td>{cliente.edad}</td>
                <td>{cliente.sexo}</td>
                <td>{cliente.clases}</td>
                <td>
                  <button className="btn-icon text-warning" onClick={() => openModal(cliente)}>
                    <FiEdit2 />
                  </button>
                  <button className="btn-icon text-danger" onClick={() => deleteMutation.mutate(cliente.id_cliente)}>
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
              <h2>{selectedCliente ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>
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
                  <label>Edad *</label>
                  <input
                    type="number"
                    value={formData.edad}
                    onChange={(e) => setFormData({ ...formData, edad: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Sexo</label>
                  <select
                    value={formData.sexo}
                    onChange={(e) => setFormData({ ...formData, sexo: e.target.value })}
                  >
                    <option value="Hombre">Hombre</option>
                    <option value="Mujer">Mujer</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {selectedCliente ? 'Actualizar' : 'Crear'} Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
