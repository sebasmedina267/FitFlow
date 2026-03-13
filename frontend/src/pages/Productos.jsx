import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiShoppingCart, FiDollarSign } from 'react-icons/fi';
import { productoService } from '../services/api';

const API_URL = 'http://localhost:3001';

export default function Productos() {
  const [modal, setModal] = useState({ type: null, data: null }); // type: 'create', 'edit', 'buy', 'sell'
  const [formData, setFormData] = useState({});
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();

  const { data: productosData, isLoading } = useQuery({
    queryKey: ['productos'],
    queryFn: () => productoService.getAll().then(res => res.data.data),
  });

  const mutationOptions = (successMessage, errorMessage) => ({
    onSuccess: () => {
      queryClient.invalidateQueries(['productos']);
      toast.success(successMessage);
      closeModal();
    },
    onError: () => toast.error(errorMessage),
  });

  const createMutation = useMutation({ mutationFn: (data) => productoService.create(data), ...mutationOptions('Producto creado', 'Error al crear') });
  const updateMutation = useMutation({ mutationFn: ({ id, data }) => productoService.update(id, data), ...mutationOptions('Producto actualizado', 'Error al actualizar') });
  const compraMutation = useMutation({ mutationFn: (data) => productoService.compra(data), ...mutationOptions('Compra registrada', 'Error en la compra') });
  const ventaMutation = useMutation({ mutationFn: (data) => productoService.venta(data), ...mutationOptions('Venta registrada', 'Error en la venta') });
  const deleteMutation = useMutation({ mutationFn: (id) => productoService.delete(id), ...mutationOptions('Producto eliminado', 'Error al eliminar') });

  const openModal = (type, data = null) => {
    setModal({ type, data });
    if (type === 'create') {
      setFormData({ nombre: '', descripcion: '', precio_compra: '', precio_venta: '', stock: 0, foto: null });
    } else if (type === 'edit') {
      setFormData({ nombre: data.nombre, descripcion: data.descripcion || '', precio_venta: data.precio_venta, foto: null });
    } else if (type === 'buy') {
      setFormData({ id_producto: data.id_producto, cantidad: 1, precio_compra: data.precio_compra });
    } else if (type === 'sell') {
      setFormData({ id_producto: data.id_producto, cantidad: 1 });
    }
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const closeModal = () => setModal({ type: null, data: null });

  const handleSubmit = (e) => {
    e.preventDefault();
    const getFormData = () => {
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        return data;
    }

    switch (modal.type) {
      case 'create': createMutation.mutate(getFormData()); break;
      case 'edit': updateMutation.mutate({ id: modal.data.id_producto, data: getFormData() }); break;
      case 'buy': compraMutation.mutate(formData); break;
      case 'sell': ventaMutation.mutate(formData); break;
      default: break;
    }
  };

  const { productos = [], totales = {} } = productosData || {};
  if (isLoading) return <div className="page-container"><p>Cargando...</p></div>;

  return (
    <div className="page-container">
        <div className="page-header">
            <h1 className="page-title">Productos</h1>
            <button className="btn btn-primary" onClick={() => openModal('create')}>
            <FiPlus /> Nuevo Producto
            </button>
        </div>

        <div className="stats-grid mb-4">
            <div className="stat-card"><h3>{productos.length}</h3><p>Productos</p></div>
            <div className="stat-card"><h3>{totales.stock_total || 0}</h3><p>Stock Total</p></div>
            <div className="stat-card"><h3>${(totales.valor_total_compra || 0)}</h3><p>Valor Compra</p></div>
            <div className="stat-card"><h3>${(totales.valor_total_venta || 0)}</h3><p>Valor Venta</p></div>
        </div>

        <div className="card">
            <table className="table">
            <thead>
                <tr>
                <th>Foto</th>
                <th>Nombre</th>
                <th>P. Compra</th>
                <th>P. Venta</th>
                <th>Stock</th>
                <th>Valor Compra</th>
                <th>Valor Venta</th>
                <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {productos.map((p) => (
                <tr key={p.id_producto}>
                    <td>{p.foto && <img src={`${API_URL}/uploads/${p.foto}`} alt={p.nombre} className="table-img" />}</td>
                    <td>{p.nombre}</td>
                    <td>${p.precio_compra}</td>
                    <td>${p.precio_venta}</td>
                    <td>{p.stock}</td>
                    <td>${p.valor_total_compra}</td>
                    <td>${p.valor_total_venta}</td>
                    <td>
                        <button className="btn-icon text-success" onClick={() => openModal('buy', p)}><FiShoppingCart /></button>
                        <button className="btn-icon text-info" onClick={() => openModal('sell', p)}><FiDollarSign /></button>
                        <button className="btn-icon text-warning" onClick={() => openModal('edit', p)}><FiEdit2 /></button>
                        <button className="btn-icon text-danger" onClick={() => deleteMutation.mutate(p.id_producto)}><FiTrash2 /></button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>

        {modal.type && (
            <div className="modal-overlay">
                <div className="modal">
                    <div className="modal-header">
                        <h2>
                            {modal.type === 'create' && 'Nuevo Producto'}
                            {modal.type === 'edit' && 'Editar Producto'}
                            {modal.type === 'buy' && 'Registrar Compra'}
                            {modal.type === 'sell' && 'Registrar Venta'}
                        </h2>
                        <button className="btn-icon" onClick={closeModal}><FiX /></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        {(modal.type === 'create' || modal.type === 'edit') && (
                            <>
                                <div className="form-group">
                                    <label>Nombre *</label>
                                    <input type="text" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} required disabled={modal.type === 'edit'} />
                                </div>
                                <div className="form-group">
                                    <label>Descripción</label>
                                    <textarea value={formData.descripcion} onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })} />
                                </div>
                                <div className="form-row">
                                    {modal.type === 'create' && <div className="form-group"><label>P. Compra *</label><input type="number" step="0.01" value={formData.precio_compra} onChange={(e) => setFormData({ ...formData, precio_compra: e.target.value })} required /></div>}
                                    <div className="form-group"><label>P. Venta *</label><input type="number" step="0.01" value={formData.precio_venta} onChange={(e) => setFormData({ ...formData, precio_venta: e.target.value })} required /></div>
                                </div>
                                {modal.type === 'create' && <div className="form-group"><label>Stock Inicial</label><input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} /></div>}
                                <div className="form-group">
                                    <label>Foto</label>
                                    <input type="file" ref={fileInputRef} onChange={(e) => setFormData({ ...formData, foto: e.target.files[0] })} />
                                </div>
                                {modal.type === 'edit' && modal.data.foto && <div className="form-group"><p>Foto actual:</p><img src={`${API_URL}/uploads/${modal.data.foto}`} alt={modal.data.nombre} className="form-preview-img"/></div>}
                            </>
                        )}
                        {modal.type === 'buy' && (
                            <>
                                <div className="form-group"><label>Cantidad *</label><input type="number" value={formData.cantidad} onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })} required /></div>
                                <div className="form-group"><label>Precio Compra *</label><input type="number" step="0.01" value={formData.precio_compra} onChange={(e) => setFormData({ ...formData, precio_compra: e.target.value })} required /></div>
                            </>
                        )}
                        {modal.type === 'sell' && (
                            <div className="form-group"><label>Cantidad *</label><input type="number" value={formData.cantidad} max={modal.data.stock} onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })} required /></div>
                        )}
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancelar</button>
                            <button type="submit" className="btn btn-primary">Confirmar</button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
}
