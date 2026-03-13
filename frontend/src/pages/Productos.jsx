import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import { productoService } from '../services/api';

export default function Productos() {
  const [showModal, setShowModal] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio_compra: '',
    precio_venta: '',
    stock: 0,
    categoria: ''
  });

  const queryClient = useQueryClient();

  const { data: productosData, isLoading } = useQuery({
    queryKey: ['productos'],
    queryFn: () => productoService.getAll().then(res => res.data)
  });

  const createMutation = useMutation({
    mutationFn: (data) => productoService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['productos']);
      toast.success('Producto creado exitosamente');
      closeModal();
    },
    onError: () => toast.error('Error al crear producto')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => productoService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['productos']);
      toast.success('Producto actualizado');
      closeModal();
    },
    onError: () => toast.error('Error al actualizar producto')
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => productoService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['productos']);
      toast.success('Producto eliminado');
    },
    onError: () => toast.error('Error al eliminar producto')
  });

  const openModal = (producto = null) => {
    if (producto) {
      setSelectedProducto(producto);
      setFormData({
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio_compra: producto.precio_compra,
        precio_venta: producto.precio_venta,
        stock: producto.stock,
        categoria: producto.categoria
      });
    } else {
      setSelectedProducto(null);
      setFormData({
        nombre: '',
        descripcion: '',
        precio_compra: '',
        precio_venta: '',
        stock: 0,
        categoria: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProducto(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedProducto) {
      updateMutation.mutate({ id: selectedProducto.id_producto, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const productos = productosData?.data?.data || [];
  const totalValor = productos.reduce((acc, p) => acc + (p.precio_venta * p.stock), 0);
  const totalStock = productos.reduce((acc, p) => acc + p.stock, 0);

  if (isLoading) return <div className="page-container"><p>Cargando...</p></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Productos</h1>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <FiPlus /> Nuevo Producto
        </button>
      </div>

      <div className="stats-grid mb-4">
        <div className="stat-card">
          <div className="stat-info">
            <h3>{productos.length}</h3>
            <p>Total Productos</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <h3>{totalStock}</h3>
            <p>Stock Total</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <h3>${totalValor.toFixed(2)}</h3>
            <p>Valor Inventario</p>
          </div>
        </div>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>P. Compra</th>
              <th>P. Venta</th>
              <th>Stock</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id_producto}>
                <td>{producto.nombre}</td>
                <td>{producto.categoria}</td>
                <td>${producto.precio_compra}</td>
                <td>${producto.precio_venta}</td>
                <td>{producto.stock}</td>
                <td>{producto.descripcion}</td>
                <td>
                  <button className="btn-icon text-warning" onClick={() => openModal(producto)}>
                    <FiEdit2 />
                  </button>
                  <button className="btn-icon text-danger" onClick={() => deleteMutation.mutate(producto.id_producto)}>
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
              <h2>{selectedProducto ? 'Editar Producto' : 'Nuevo Producto'}</h2>
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
                  <label>Categoría</label>
                  <input
                    type="text"
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Precio Compra *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.precio_compra}
                    onChange={(e) => setFormData({ ...formData, precio_compra: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Precio Venta *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.precio_venta}
                    onChange={(e) => setFormData({ ...formData, precio_venta: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {selectedProducto ? 'Actualizar' : 'Crear'} Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
