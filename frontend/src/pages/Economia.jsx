import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { FiPlus, FiDownload, FiX, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { economiaService } from '../services/api';

export default function Economia() {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('ingreso');
  const [formData, setFormData] = useState({ concepto: '', cantidad: '' });
  const [filtros, setFiltros] = useState({ fecha_inicio: '', fecha_fin: '' });

  const queryClient = useQueryClient();

  const { data: balanceData, isLoading: isLoadingBalance } = useQuery({
    queryKey: ['balance', filtros],
    queryFn: () => economiaService.getBalance(filtros).then(res => res.data)
  });

  const { data: estadisticasData, isLoading: isLoadingEstadisticas } = useQuery({
    queryKey: ['estadisticas', filtros],
    queryFn: () => economiaService.getEstadisticas(filtros).then(res => res.data)
  });

  const ingresoMutation = useMutation({
    mutationFn: (data) => economiaService.createIngreso(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['balance']);
      toast.success('Ingreso registrado');
      closeModal();
    },
    onError: () => toast.error('Error al registrar ingreso')
  });

  const gastoMutation = useMutation({
    mutationFn: (data) => economiaService.createGasto(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['balance']);
      toast.success('Gasto registrado');
      closeModal();
    },
    onError: () => toast.error('Error al registrar gasto')
  });

  const openModal = (type) => {
    setModalType(type);
    setFormData({ concepto: '', cantidad: '' });
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...formData, cantidad: parseFloat(formData.cantidad) };
    if (modalType === 'ingreso') {
      ingresoMutation.mutate(data);
    } else {
      gastoMutation.mutate(data);
    }
  };

  const exportPDF = async () => {
    try {
      const response = await economiaService.exportarPDF(filtros);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `reporte_economia_${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('PDF descargado');
    } catch {
      toast.error('Error al exportar PDF');
    }
  };

  const balance = balanceData || {};
  const chartData = estadisticasData?.grafica || [];

  if (isLoadingBalance || isLoadingEstadisticas) {
    return (
      <div className="page-container">
        <div className="loading-overlay">
          <div className="spinner spinner--lg text-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Economía General</h1>
        <div className="header-actions">
          <button className="btn btn-success" onClick={() => openModal('ingreso')}>
            <FiPlus /> Nuevo Ingreso
          </button>
          <button className="btn btn-danger" onClick={() => openModal('gasto')}>
            <FiPlus /> Nuevo Gasto
          </button>
          <button className="btn btn-primary" onClick={exportPDF}>
            <FiDownload /> Exportar PDF
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="card mb-4">
        <div className="form-row">
          <div className="form-group">
            <label>Fecha Inicio</label>
            <input
              type="date"
              value={filtros.fecha_inicio}
              onChange={(e) => setFiltros({ ...filtros, fecha_inicio: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Fecha Fin</label>
            <input
              type="date"
              value={filtros.fecha_fin}
              onChange={(e) => setFiltros({ ...filtros, fecha_fin: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Balance */}
      {balance && (
        <div className="stats-grid mb-4">
          <div className="stat-card">
            <div className="stat-icon bg-success"><FiTrendingUp /></div>
            <div className="stat-info">
              <h3 className="text-success">+${balance.totalIngresos?.toFixed(2) || '0.00'}</h3>
              <p>Total Ingresos</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon bg-danger"><FiTrendingDown /></div>
            <div className="stat-info">
              <h3 className="text-danger">-${balance.totalGastos?.toFixed(2) || '0.00'}</h3>
              <p>Total Gastos</p>
            </div>
          </div>
          <div className="stat-card">
            <div className={`stat-icon ${balance.beneficios >= 0 ? 'bg-success' : 'bg-danger'}`}>
              {balance.beneficios >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
            </div>
            <div className="stat-info">
              <h3 className={balance.beneficios >= 0 ? 'text-success' : 'text-danger'}>
                ${balance.beneficios?.toFixed(2) || '0.00'}
              </h3>
              <p>Beneficios</p>
            </div>
          </div>
        </div>
      )}

      {/* Gráfica */}
      <div className="chart-card mb-4">
        <h3>Evolución Ingresos/Gastos</h3>
        {chartData.length > 0 ? (
          <div className="chart-card__content" style={{ height: '350px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%" minHeight={280}>
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="periodo" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                <Legend />
                <Bar dataKey="ingresos" fill="#10B981" name="Ingresos" radius={[4, 4, 0, 0]} />
                <Bar dataKey="gastos" fill="#EF4444" name="Gastos" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="no-data">Sin datos para el período</p>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{modalType === 'ingreso' ? 'Nuevo Ingreso' : 'Nuevo Gasto'}</h2>
              <button className="btn-icon" onClick={closeModal}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Concepto *</label>
                <input
                  type="text"
                  value={formData.concepto}
                  onChange={(e) => setFormData({ ...formData, concepto: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Cantidad *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.cantidad}
                  onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
                  required
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancelar
                </button>
                <button type="submit" className={`btn ${modalType === 'ingreso' ? 'btn-success' : 'btn-danger'}`}>
                  Registrar {modalType === 'ingreso' ? 'Ingreso' : 'Gasto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
