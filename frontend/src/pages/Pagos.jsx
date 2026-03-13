import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import { pagoService } from '../services/api';

export default function Pagos() {
  const [showModal, setShowModal] = useState(false);
  const [selectedPago, setSelectedPago] = useState(null);
  const [formData, setFormData] = useState({
    cliente_id: '',
    monto: '',
    concepto: '',
    fecha_pago: '',
    metodo_pago: 'efectivo',
    estado: 'completado'
  });

  const queryClient = useQueryClient();

  const { data: pagosData, isLoading } = useQuery({
    queryKey: ['pagos'],
    queryFn: () => pagoService.getAll().then(res => res.data)
  });

  const createMutation = useMutation({
    mutationFn: (data) => pagoService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['pagos']);
      toast.success('Pago registrado exitosamente');
      closeModal();
    },
    onError: () => toast.error('Error al registrar pago')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => pagoService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['pagos']);
      toast.success('Pago actualizado');
      closeModal();
    },
    onError: () => toast.error('Error al actualizar pago')
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => pagoService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['pagos']);
      toast.success('Pago eliminado');
    },
    onError: () => toast.error('Error al eliminar pago')
  });

  const openModal = (pago = null) => {
    if (pago) {
      setSelectedPago(pago);
      setFormData({
        cliente_id: pago.cliente_id,
        monto: pago.monto,
        concepto: pago.concepto,
        fecha_pago: pago.fecha_pago,
        metodo_pago: pago.metodo_pago,
        estado: pago.estado
      });
    } else {
      setSelectedPago(null);
      setFormData({
        cliente_id: '',
        monto: '',
        concepto: '',
        fecha_pago: new Date().toISOString().split('T')[0],
        metodo_pago: 'efectivo',
        estado: 'completado'
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPago(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedPago) {
      updateMutation.mutate({ id: selectedPago.id_pago, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const pagos = pagosData?.data?.data || [];
  const totalPagos = pagos.reduce((acc, p) => acc + parseFloat(p.monto || 0), 0);

  if (isLoading) return <div className="page-container"><p>Cargando...</p></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Pagos</h1>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <FiPlus /> Registrar Pago
        </button>
      </div>

      <div className="stats-grid mb-4">
        <div className="stat-card">
          <div className="stat-info">
            <h3>{pagos.length}</h3>
            <p>Total Pagos</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <h3>${totalPagos.toFixed(2)}</h3>
            <p>Total Recaudado</p>
          </div>
        </div>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Monto</th>
              <th>Concepto</th>
              <th>Método de Pago</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pagos.map((pago) => (
              <tr key={pago.id_pago}>
                <td>{pago.cliente_nombre}</td>
                <td>${pago.monto}</td>
                <td>{pago.concepto}</td>
                <td>{pago.metodo_pago}</td>
                <td>{new Date(pago.fecha_pago).toLocaleDateString()}</td>
                <td>
                  <span className={`badge ${pago.estado === 'completado' ? 'badge-success' : 'badge-warning'}`}>
                    {pago.estado}
                  </span>
                </td>
                <td>
                  <button className="btn-icon text-warning" onClick={() => openModal(pago)}>
                    <FiEdit2 />
                  </button>
                  <button className="btn-icon text-danger" onClick={() => deleteMutation.mutate(pago.id_pago)}>
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
              <h2>{selectedPago ? 'Editar Pago' : 'Registrar Pago'}</h2>
              <button className="btn-icon" onClick={closeModal}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Cliente ID *</label>
                <input
                  type="number"
                  value={formData.cliente_id}
                  onChange={(e) => setFormData({ ...formData, cliente_id: e.target.value })}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Monto *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.monto}
                    onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Concepto</label>
                  <input
                    type="text"
                    value={formData.concepto}
                    onChange={(e) => setFormData({ ...formData, concepto: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Fecha de Pago</label>
                  <input
                    type="date"
                    value={formData.fecha_pago}
                    onChange={(e) => setFormData({ ...formData, fecha_pago: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Método de Pago</label>
                  <select
                    value={formData.metodo_pago}
                    onChange={(e) => setFormData({ ...formData, metodo_pago: e.target.value })}
                  >
                    <option value="efectivo">Efectivo</option>
                    <option value="tarjeta">Tarjeta</option>
                    <option value="transferencia">Transferencia</option>
                    <option value="cheque">Cheque</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Estado</label>
                <select
                  value={formData.estado}
                  onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                >
                  <option value="completado">Completado</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {selectedPago ? 'Actualizar' : 'Registrar'} Pago
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
