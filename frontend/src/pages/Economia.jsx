
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { FiPlus, FiDownload, FiX, FiTrendingUp, FiTrendingDown, FiFilter, FiBarChart2 } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { economiaService } from '../services/api';

const StatCard = ({ title, value, icon, colorClass }) => (
  <div className="stat-card">
    <div className={`stat-icon ${colorClass}`}>{icon}</div>
    <div className="stat-info">
      <h3 className={colorClass}>${value.toFixed(2)}</h3>
      <p>{title}</p>
    </div>
  </div>
);

const TransactionTable = ({ title, items, isExpense = false }) => (
  <div className="card mb-4">
    <div className="card-header">{title}</div>
    <table className="table">
      <thead><tr><th>Fecha</th><th>Concepto</th><th>Monto</th></tr></thead>
      <tbody>
        {items.map(item => (
          <tr key={item.id}>
            <td>{new Date(item.fecha).toLocaleDateString()}</td>
            <td>{item.concepto}</td>
            <td className={isExpense ? 'text-danger' : 'text-success'}>${item.cantidad.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default function Economia() {
  const [modal, setModal] = useState({ type: null }); // 'ingreso' | 'gasto'
  const [formData, setFormData] = useState({ concepto: '', cantidad: '' });
  const [filters, setFilters] = useState({ fecha_inicio: '', fecha_fin: '' });
  const [periodo, setPeriodo] = useState('mes');
  const queryClient = useQueryClient();

  const { data: balance, isLoading: loadingBalance } = useQuery({ 
    queryKey: ['balance', filters], 
    queryFn: () => economiaService.getBalance(filters).then(res => res.data.data) 
  });
  const { data: stats, isLoading: loadingStats } = useQuery({ 
    queryKey: ['economia-stats', periodo], 
    queryFn: () => economiaService.getEstadisticas({ periodo }).then(res => res.data.data) 
  });
  const { data: ingresosExtra, isLoading: loadingIE } = useQuery({ queryKey: ['ingresosExtra', filters], queryFn: () => economiaService.getIngresos(filters).then(res => res.data.data) });
  const { data: gastosExtra, isLoading: loadingGE } = useQuery({ queryKey: ['gastosExtra', filters], queryFn: () => economiaService.getGastos(filters).then(res => res.data.data) });

  const mutationOptions = (type) => ({
    onSuccess: () => {
      queryClient.invalidateQueries(['balance', 'economia-stats', `${type}sExtra`]);
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} registrado`);
      setModal({ type: null });
    },
    onError: (err) => toast.error(err.response?.data?.message || `Error al registrar ${type}`)
  });

  const ingresoMutation = useMutation({ mutationFn: economiaService.createIngreso, ...mutationOptions('ingreso') });
  const gastoMutation = useMutation({ mutationFn: economiaService.createGasto, ...mutationOptions('gasto') });

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...formData, cantidad: parseFloat(formData.cantidad) };
    modal.type === 'ingreso' ? ingresoMutation.mutate(data) : gastoMutation.mutate(data);
  };

  const exportPDF = async () => {
    try {
      const res = await economiaService.exportarPDF(filters);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `reporte_${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click(); link.remove();
      toast.success('Reporte descargado');
    } catch { toast.error('Error al exportar'); }
  };

  const chartData = (stats?.ingresos || []).map(i => ({
    periodo: i.periodo,
    ingresos: i.total,
    gastos: stats?.gastos.find(g => g.periodo === i.periodo)?.total || 0
  }));

  const isLoading = loadingBalance || loadingStats || loadingIE || loadingGE;
  if (isLoading) return <p>Cargando...</p>;
  
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Economía</h1>
        <div className="header-actions">
          <button className="btn btn-success" onClick={() => setModal({ type: 'ingreso' })}><FiPlus /> Ingreso</button>
          <button className="btn btn-danger" onClick={() => setModal({ type: 'gasto' })}><FiPlus /> Gasto</button>
          <button className="btn btn-primary" onClick={exportPDF}><FiDownload /> Exportar PDF</button>
        </div>
      </div>

      <div className="card mb-4"><div className="card-header"><FiFilter/> Filtros</div><div className="card-body form-row"><div className="form-group"><label>Fecha Inicio</label><input type="date" value={filters.fecha_inicio} onChange={(e) => setFilters({ ...filters, fecha_inicio: e.target.value })}/></div><div className="form-group"><label>Fecha Fin</label><input type="date" value={filters.fecha_fin} onChange={(e) => setFilters({ ...filters, fecha_fin: e.target.value })}/></div></div></div>

      <div className="stats-grid mb-4">
        <StatCard title="Ingresos" value={balance?.ingresos.total || 0} icon={<FiTrendingUp/>} colorClass="text-success" />
        <StatCard title="Gastos" value={balance?.gastos.total || 0} icon={<FiTrendingDown/>} colorClass="text-danger" />
        <StatCard title="Beneficios" value={balance?.beneficios || 0} icon={balance?.beneficios >= 0 ? <FiTrendingUp/> : <FiTrendingDown/>} colorClass={balance?.beneficios >= 0 ? 'text-success' : 'text-danger'} />
      </div>

      <div className="card mb-4"><div className="card-header"><FiBarChart2/> Estadísticas</div><div className="card-body"><div className="form-group"><label>Período</label><select value={periodo} onChange={(e) => setPeriodo(e.target.value)}><option value="dia">Diario</option><option value="mes">Mensual</option><option value="ano">Anual</option></select></div><div style={{ height: 300 }}><ResponsiveContainer><BarChart data={chartData}><CartesianGrid/><XAxis dataKey="periodo"/><YAxis/><Tooltip/><Legend/><Bar dataKey="ingresos" fill="#10B981" name="Ingresos"/><Bar dataKey="gastos" fill="#EF4444" name="Gastos"/></BarChart></ResponsiveContainer></div></div></div>
      
      <div className="grid-2-col">
        <TransactionTable title="Ingresos Extra" items={ingresosExtra || []} />
        <TransactionTable title="Gastos Extra" items={gastosExtra || []} isExpense={true} />
      </div>

      {modal.type && (
        <div className="modal-overlay"><div className="modal"><div className="modal-header"><h2>{`Nuevo ${modal.type}`}</h2><button className="btn-icon" onClick={() => setModal({ type: null })}><FiX/></button></div><form onSubmit={handleSubmit}><div className="form-group"><label>Concepto</label><input type="text" value={formData.concepto} onChange={e => setFormData({...formData, concepto: e.target.value})} required/></div><div className="form-group"><label>Cantidad</label><input type="number" step="0.01" min="0" value={formData.cantidad} onChange={e => setFormData({...formData, cantidad: e.target.value})} required/></div><div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={() => setModal({ type: null })}>Cancelar</button><button type="submit" className={`btn ${modal.type === 'ingreso' ? 'btn-success' : 'btn-danger'}`}>Registrar</button></div></form></div></div>
      )}
    </div>
  );
}
