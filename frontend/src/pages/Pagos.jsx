import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { FiFilter, FiCheck, FiX, FiPlusCircle } from 'react-icons/fi';
import { pagoService, clienteService, claseService } from '../services/api';

const PagoModal = ({ modal, closeModal, handleSubmit, formData, setFormData, clientes, clases }) => {
  if (!modal.type) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>
            {modal.type === 'pay' && 'Confirmar Pago'}
            {modal.type === 'create' && 'Crear Pago Pendiente'}
          </h2>
          <button className="btn-icon" onClick={closeModal}><FiX /></button>
        </div>
        <form onSubmit={handleSubmit}>
          {modal.type === 'pay' && (
            <div className="form-group">
              <label>Importe a Pagar *</label>
              <input type="number" step="0.01" value={formData.importe} onChange={(e) => setFormData({ ...formData, importe: e.target.value })} required />
            </div>
          )}
          {modal.type === 'create' && (
            <>
              <div className="form-group"><label>Cliente *</label><select value={formData.id_cliente} onChange={(e) => setFormData({ ...formData, id_cliente: e.target.value })} required>{clientes.map(c => <option key={c.id_cliente} value={c.id_cliente}>{c.nombre}</option>)}</select></div>
              <div className="form-group"><label>Clase *</label><select value={formData.id_clase} onChange={(e) => setFormData({ ...formData, id_clase: e.target.value })} required>{clases.map(c => <option key={c.id_clase} value={c.id_clase}>{c.nombre}</option>)}</select></div>
              <div className="form-group"><label>Importe *</label><input type="number" step="0.01" value={formData.importe} onChange={(e) => setFormData({ ...formData, importe: e.target.value })} required /></div>
            </>
          )}
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Confirmar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function Pagos() {
  const [filters, setFilters] = useState({ pagado: 'all', fecha_inicio: '', fecha_fin: '' });
  const [modal, setModal] = useState({ type: null, data: null });
  const [formData, setFormData] = useState({});
  const queryClient = useQueryClient();

  const { data: pagos, isLoading } = useQuery({ 
    queryKey: ['pagos', filters], 
    queryFn: () => pagoService.getAll(filters).then(res => res.data.data) 
  });
  const { data: stats } = useQuery({ queryKey: ['pagos-stats'], queryFn: () => pagoService.getEstadisticas().then(res => res.data.data) });
  const { data: clientes } = useQuery({ queryKey: ['clientes'], queryFn: () => clienteService.getAll().then(res => res.data.data) });
  const { data: clases } = useQuery({ queryKey: ['clases'], queryFn: () => claseService.getAll().then(res => res.data.data) });

  const mutationOptions = (message) => ({
    onSuccess: () => { queryClient.invalidateQueries(['pagos']); queryClient.invalidateQueries(['pagos-stats']); toast.success(message); closeModal(); },
    onError: (err) => toast.error(err.response?.data?.message || 'Error'),
  });

  const pagarMutation = useMutation({ mutationFn: ({ id, data }) => pagoService.marcarPagado(id, data), ...mutationOptions('Pago registrado') });
  const desmarcarMutation = useMutation({ mutationFn: (id) => pagoService.marcarNoPagado(id), ...mutationOptions('Pago desmarcado') });
  const createMutation = useMutation({ mutationFn: (data) => pagoService.create(data), ...mutationOptions('Pago pendiente creado') });

  const openModal = (type, data = null) => {
    setModal({ type, data });
    if (type === 'pay') setFormData({ importe: data.precio_clase });
    if (type === 'create') setFormData({ id_cliente: clientes?.[0]?.id_cliente || '', id_clase: clases?.[0]?.id_clase || '', importe: clases?.[0]?.precio || '' });
  };

  const closeModal = () => setModal({ type: null, data: null });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modal.type === 'pay') pagarMutation.mutate({ id: modal.data.id_pago, data: formData });
    if (modal.type === 'create') createMutation.mutate(formData);
  };

  const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  if (isLoading) return <p>Cargando...</p>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Gestión de Pagos</h1>
        <button className="btn btn-primary" onClick={() => openModal('create')}><FiPlusCircle /> Crear Pago Pendiente</button>
      </div>

      <div className="stats-grid mb-4">
        <div className="stat-card"><h3>${parseFloat(stats?.totalPagado || 0).toFixed(2)}</h3><p>Total Pagado</p></div>
        <div className="stat-card"><h3>{stats?.totalPendientes || 0}</h3><p>Pagos Pendientes</p></div>
      </div>

      <div className="card mb-4">
        <div className="card-header"><FiFilter /> Filtros</div>
        <div className="card-body form-row">
          <div className="form-group"><label>Estado</label><select name="pagado" value={filters.pagado} onChange={handleFilterChange}><option value="all">Todos</option><option value="true">Pagado</option><option value="false">Pendiente</option></select></div>
          <div className="form-group"><label>Fecha Inicio</label><input type="date" name="fecha_inicio" value={filters.fecha_inicio} onChange={handleFilterChange} /></div>
          <div className="form-group"><label>Fecha Fin</label><input type="date" name="fecha_fin" value={filters.fecha_fin} onChange={handleFilterChange} /></div>
        </div>
      </div>

      <div className="card">
        <table className="table">
          <thead><tr><th>Cliente</th><th>Clase</th><th>Importe</th><th>Fecha Pago</th><th>Estado</th><th>Acciones</th></tr></thead>
          <tbody>
            {(pagos || []).map(p => (
              <tr key={p.id_pago}>
                <td>{p.cliente_nombre}</td>
                <td>{p.clase_nombre}</td>
                <td>${parseFloat(p.importe || 0).toFixed(2)}</td>
                <td>{p.fecha_pago ? new Date(p.fecha_pago).toLocaleDateString() : 'N/A'}</td>
                <td><span className={`badge ${p.pagado ? 'badge-success' : 'badge-warning'}`}>{p.pagado ? 'Pagado' : 'Pendiente'}</span></td>
                <td>
                  {p.pagado ? (
                    <button className="btn-icon text-danger" onClick={() => desmarcarMutation.mutate(p.id_pago)}><FiX /> Desmarcar</button>
                  ) : (
                    <button className="btn-icon text-success" onClick={() => openModal('pay', p)}><FiCheck /> Marcar como Pagado</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <PagoModal modal={modal} closeModal={closeModal} handleSubmit={handleSubmit} formData={formData} setFormData={setFormData} clientes={clientes || []} clases={clases || []} />
    </div>
  );
}
